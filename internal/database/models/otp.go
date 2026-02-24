package models

import (
	"crypto/rand"
	"crypto/subtle"
	"errors"
	"fmt"
	"math/big"
	"os"
	"strconv"
	"time"

	"authy-api/pkg/crypto"

	"gorm.io/gorm"
	"gorm.io/gorm/clause"
)

type OTP struct {
	ID           uint      `gorm:"primaryKey"`
	UserID       uint      `gorm:"not null;uniqueIndex:idx_otp_unique,priority:1"`
	CodeHash     []byte    `gorm:"type:binary(32);not null"`
	Identifier   string    `gorm:"not null;uniqueIndex:idx_otp_unique,priority:2"`
	Platform     string    `gorm:"not null;uniqueIndex:idx_otp_unique,priority:3"`
	Sender       string    `gorm:"not null;uniqueIndex:idx_otp_unique,priority:4"`
	ExpiresAt    time.Time `gorm:"not null;index"`
	AttemptCount int       `gorm:"default:0;not null"`
	MaxAttempts  int       `gorm:"default:3;not null"`
	CreatedAt    time.Time `gorm:"not null"`

	User User `gorm:"foreignKey:UserID;constraint:OnDelete:CASCADE"`
}

func (OTP) TableName() string {
	return "otps"
}

func (o *OTP) SetCode(code string) error {
	hash, err := crypto.Hash(code)
	if err != nil {
		return err
	}
	o.CodeHash = hash
	return nil
}

func (o *OTP) CompareCode(code string) error {
	hash, err := crypto.Hash(code)
	if err != nil {
		return err
	}

	if subtle.ConstantTimeCompare(o.CodeHash, hash) != 1 {
		return errors.New("code does not match")
	}
	return nil
}

func GenerateOTP(length int) (string, error) {
	if length <= 0 {
		length = 6
	}

	limit := new(big.Int).Exp(big.NewInt(10), big.NewInt(int64(length)), nil)

	n, err := rand.Int(rand.Reader, limit)
	if err != nil {
		return "", fmt.Errorf("failed to generate OTP: %w", err)
	}

	format := fmt.Sprintf("%%0%dd", length)
	return fmt.Sprintf(format, n), nil
}

func CreateOTP(db *gorm.DB, userID uint, identifier, platform, sender string) (string, time.Time, error) {
	maxAttempts := 3
	if maxAttemptsStr := os.Getenv("OTP_MAX_ATTEMPTS"); maxAttemptsStr != "" {
		if max, err := strconv.Atoi(maxAttemptsStr); err == nil && max > 0 {
			maxAttempts = max
		}
	}

	otpLength := 6
	if lengthStr := os.Getenv("OTP_LENGTH"); lengthStr != "" {
		if length, err := strconv.Atoi(lengthStr); err == nil && length > 0 {
			otpLength = length
		}
	}

	expiryMinutes := 10
	if expiryStr := os.Getenv("OTP_EXPIRY_MINUTES"); expiryStr != "" {
		if expiry, err := strconv.Atoi(expiryStr); err == nil && expiry > 0 {
			expiryMinutes = expiry
		}
	}

	code, err := GenerateOTP(otpLength)
	if err != nil {
		return "", time.Time{}, err
	}

	expiresAt := time.Now().UTC().Add(time.Duration(expiryMinutes) * time.Minute)

	otp := &OTP{
		UserID:       userID,
		Identifier:   identifier,
		Platform:     platform,
		Sender:       sender,
		ExpiresAt:    expiresAt,
		AttemptCount: 0,
		MaxAttempts:  maxAttempts,
		CreatedAt:    time.Now().UTC(),
	}

	if err := otp.SetCode(code); err != nil {
		return "", time.Time{}, err
	}

	if err := db.Clauses(clause.OnConflict{
		Columns: []clause.Column{
			{Name: "user_id"}, {Name: "identifier"}, {Name: "platform"}, {Name: "sender"},
		},
		DoUpdates: clause.AssignmentColumns([]string{"code_hash", "expires_at", "attempt_count", "max_attempts", "created_at"}),
	}).Create(otp).Error; err != nil {
		return "", time.Time{}, fmt.Errorf("failed to create OTP: %w", err)
	}

	return code, expiresAt, nil
}

func VerifyOTP(db *gorm.DB, userID uint, identifier, platform, sender, code string) error {
	var otp OTP
	err := db.Clauses(clause.Locking{Strength: "UPDATE", Options: "NOWAIT"}).
		Where("user_id = ? AND identifier = ? AND platform = ? AND sender = ? AND expires_at > ?",
			userID, identifier, platform, sender, time.Now().UTC()).
		Order("created_at DESC").First(&otp).Error
	if err != nil {
		return errors.New("invalid or expired OTP")
	}

	if err := db.Model(&otp).Update("attempt_count", gorm.Expr("attempt_count + 1")).Error; err != nil {
		return fmt.Errorf("failed to update attempts: %w", err)
	}

	if err := db.First(&otp, otp.ID).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return errors.New("OTP was invalidated or expired during verification")
		}
		return err
	}

	if otp.AttemptCount > otp.MaxAttempts {
		db.Delete(&otp)
		return errors.New("too many attempts, please request a new code")
	}

	if err := otp.CompareCode(code); err != nil {
		return errors.New("invalid code")
	}

	db.Delete(&otp)
	return nil
}

func CleanupExpiredOTPs(db *gorm.DB) error {
	return db.Where("expires_at <= ?", time.Now().UTC()).Delete(&OTP{}).Error
}
