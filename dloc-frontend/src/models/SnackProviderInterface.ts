import { VariantType } from "notistack";

export interface SnackProviderInterface {
  addSnackbar: {
    (variant: VariantType, message: string): void;
  }
}