terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "2.58.0"
    }

    tls = {
      source  = "hashicorp/tls"
      version = "3.1.0"
    }
  }
}

provider "azurerm" {
  features {}
}

provider "tls" {
}
