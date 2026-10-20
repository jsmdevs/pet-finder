type Location = {
    lat: number,
    lng: number
}

export interface PetFormData {
    name: string,
    location: Location | null,
    nameLocation: string,
    image: string
}

export type ValidationResult =
    | { valid: true }
    | { valid: false; errors: Partial<Record<keyof PetFormData, string>> };

export function validatePostData(data: Partial<PetFormData>): ValidationResult {
    const errors: Partial<Record<keyof PetFormData, string>> = {};

    if (!data.name?.trim()) {
        errors.name = "El nombre es obligatorio";
    }
    
    if (!data.location) {
        errors.location = "Marcá la ubicación en el mapa";
    }

    if (!data.image) {
        errors.image = "Subí una foto de la mascota";
    }

    return Object.keys(errors).length
        ? { valid: false, errors }
        : { valid: true };
}