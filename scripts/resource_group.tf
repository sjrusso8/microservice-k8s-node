resource "azurerm_resource_group" "aks_resource" {
  name     = var.resource_name
  location = var.location
}
