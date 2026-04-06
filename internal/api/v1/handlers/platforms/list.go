package platforms

import (
	"fmt"
	"net/http"
	"runtime/debug"

	"authy-api/pkg/interfaceclient"
	"authy-api/pkg/logger"

	"github.com/labstack/echo/v4"
)

// List godoc
//
//	@Summary		List available platforms
//	@Description	List all unique available platforms
//	@Tags			platforms
//	@Accept			json
//	@Produce		json
//	@Success		200	{object}	ListPlatformsResponse	"List of platforms retrieved successfully"
//	@Failure		500	{object}	ErrorResponse			"Internal server error"
//	@Router			/api/v1/platforms [get]
func (h *PlatformHandler) List(c echo.Context) error {
	interfaceClient, err := interfaceclient.New()
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to initialize interface client: %v\n%s", err, debug.Stack()))
		return echo.ErrInternalServerError
	}

	devices, err := interfaceClient.ListDevices()
	if err != nil {
		logger.Error(fmt.Sprintf("Failed to list devices: %v\n%s", err, debug.Stack()))
		return echo.ErrInternalServerError
	}

	platformMap := make(map[string]bool)
	for _, device := range devices {
		platformMap[device.Platform] = true
	}

	platforms := make(ListPlatformsResponse, 0, len(platformMap))
	for platform := range platformMap {
		platforms = append(platforms, platform)
	}

	logger.Info("Platforms listed successfully")
	return c.JSON(http.StatusOK, platforms)
}
