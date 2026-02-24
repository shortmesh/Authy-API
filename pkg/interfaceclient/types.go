package interfaceclient

type SendMessageRequest struct {
	DeviceID string `json:"-"`
	Contact  string `json:"contact"`
	Platform string `json:"platform"`
	Text     string `json:"text"`
}

type SendMessageResponse struct {
	Message string `json:"message"`
}

type Device struct {
	DeviceID string `json:"device_id"`
	Platform string `json:"platform"`
}

type ListDevicesResponse []Device
