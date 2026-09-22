import { Pet } from "../models/models";
import { client } from "../lib/algolia";
import { z } from 'zod';
import { messages } from "../utils/messages";

class PetController {

    public static async getPets() {
        const allPets = await Pet.findAll();
        return ({ success: true, status: 200, message: "Registros obtenidos", data: allPets });
    }

    public static async createPet(
        UserId: string, { name, location, imageUrl }:
            {
                name: string,
                location: string,
                imageUrl: string
            }
    ) {
        const newPet = await Pet.create({
            name,
            status: "lost",
            location,
            imageUrl,
            UserId: parseInt(UserId)
        });

        const [lat, lng] = location.split(", ").map(Number);

        try {
            client.saveObjects({
                indexName: "pets",
                objects: [{
                    objectID: newPet.get("id"),
                    _geoloc: {
                        lat,
                        lng
                    }
                }]
            });

            return ({ success: true, status: 200, message: "Publicación agregada con éxito" });

        } catch (error: any) {
            return ({ success: false, status: 500, message: "Hubo un problema al guardar los datos en Algolia" });
        }
    };

    public static async edit(
        { name, location, imageUrl }: {
            name?: string;
            location?: string;
            imageUrl?: string
        },
        UserId: string,
        idPet: string
    ) {

        const UpdatePetSchema = z.object({
            name: z.string().optional(),
            location: z.string().optional(),
            imageUrl: z.string().optional(),
        });
        const auth_UserId = parseInt(UserId);
        const pet = await Pet.findByPk(idPet);

        if (pet) {
            const pet_UserId = pet.get("UserId");

            if (pet_UserId === auth_UserId) {
                await pet.update(UpdatePetSchema.parse({ idPet, name, location, imageUrl }));

                if (location) {
                    let lat: number | undefined;
                    let lng: number | undefined;
                    const coords = location.split(',').map((c) => Number(c.trim()));

                    if (coords.length === 2 && !isNaN(coords[0]) && !isNaN(coords[1])) {
                        lat = coords[0];
                        lng = coords[1];
                    };
                    await client.partialUpdateObject({
                        indexName: 'pets',
                        objectID: idPet as string,
                        attributesToUpdate: {
                            _geoloc: {
                                lat,
                                lng
                            }
                        },
                    });
                };

                return ({ success: true, status: 200, message: messages.petUpdated });
            } else {
                return ({ success: false, status: 403, message: messages.unauthorizedPet });
            }
        } else {
            return ({ success: false, status: 404, message: messages.petNotFound });
        }
    }

    public static async nearby(radius: number, lat: number, lng: number) {
        const nearbyPets = await client.searchSingleIndex({
            indexName: "pets",
            searchParams: {
                aroundLatLng: `${lat}, ${lng}`,
                aroundRadius: radius || 200,
                hitsPerPage: 1000
            }
        });

        return ({ success: true, status: 200, message: "success", data: nearbyPets });
    }

    public static async delete(id: string, UserId: string) {
        const pet = await Pet.findByPk(id);
        const auth_UserId = parseInt(UserId);

        if (pet) {
            const pet_UserId = pet.get("UserId");

            if (pet_UserId === auth_UserId) {
                await pet.destroy();
                await client.deleteObject({
                    indexName: "pets",
                    objectID: id
                });

                return ({ success: true, status: 200, message: messages.petDelete });

            } else {
                return ({ success: false, status: 403, message: messages.unauthorizedPet });
            }
        } else {
            return ({ success: false, status: 404, message: messages.petNotFound });
        };
    };
}

export default PetController;