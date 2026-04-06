package web

import (
	"embed"
	"io/fs"
	"net/http"

	"github.com/labstack/echo/v4"
)

//go:embed dist
var distFS embed.FS

func RegisterRoutes(e *echo.Echo) error {
	distSubFS, err := fs.Sub(distFS, "dist")
	if err != nil {
		return err
	}

	e.GET("/demo", echo.WrapHandler(http.StripPrefix("/demo", http.FileServer(http.FS(distSubFS)))))
	e.GET("/demo/*", echo.WrapHandler(http.StripPrefix("/demo", http.FileServer(http.FS(distSubFS)))))

	return nil
}
