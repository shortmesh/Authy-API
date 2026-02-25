package platforms

import (
	"net/http"
	"runtime/debug"

	"authy-api/pkg/interfaceclient"
	"authy-api/pkg/logger"

	"github.com/labstack/echo/v4"
)

// List godoc
//
//	@Summary		List available platforms
//	@Description	List all available platforms and their senders
//	@Tags			platforms
//	@Accept			json
//	@Produce		json
//	@Security		BasicAuth
//	@Success		200	{object}	ListPlatformsResponse	"List of platforms retrieved successfully"
//	@Failure		401	{object}	ErrorResponse			"Unauthorized"
//	@Failure		500	{object}	ErrorResponse			"Internal server error"
//	@Router			/api/v1/platforms [get]
func (h *PlatformHandler) List(c echo.Context) error {
	interfaceClient, err := interfaceclient.New()
	if err != nil {
		logger.Log.Errorf("Failed to initialize interface client: %v\n%s", err, debug.Stack())
		return echo.ErrInternalServerError
	}

	devices, err := interfaceClient.ListDevices()
	if err != nil {
		logger.Log.Errorf("Failed to list devices: %v\n%s", err, debug.Stack())
		return echo.ErrInternalServerError
	}

	platforms := make(ListPlatformsResponse, 0, len(devices))
	for _, device := range devices {
		platforms = append(platforms, Platform{
			Platform: device.Platform,
			Sender:   device.DeviceID,
		})
	}

	logger.Log.Info("Platforms listed successfully")
	return c.JSON(http.StatusOK, platforms)
}
