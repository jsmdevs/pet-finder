import { Report, User } from "../models/models";
import { Pet } from "../models/models";
import { z } from 'zod';
import { messages } from "../utils/messages";
import { sendMail } from "../services/email/mailServices";



class ReportController {

    public static async create({ name, location, imageUrl, PetId, reportNumber }: { name: string, reportNumber: number, imageUrl: string, location: string, PetId: string, timestamp: number, UserId: string }, timestamp: number, UserId: string) {

        const exists = (await Pet.count({ where: { id: PetId } as any })) > 0;

        if (exists) {
            // await Report.create({
            //     name,
            //     reportNumber,
            //     imageUrl,
            //     location,
            //     timestamp,
            //     PetId,
            //     UserId
            // });

            const petInstance = await Pet.findOne({
                where: { id: PetId } as any,
                attributes: ['id'], // Atributos de Pet que necesitas
                include: [{
                    model: User,
                    attributes: ['email'] // Trae únicamente el email del usuario
                }]
            });

            if (petInstance) {
                const pet = petInstance.toJSON();
                const userEmail = pet.User?.email;

                sendMail(userEmail, "reportePerdidaTemplate");

                return ({ success: true, tatus: 200, message: "Reporte creado con éxito" });
            } else {
                return ({ success: false, status: 500, message: "Hubo un error al obtener la información del reportador" });
            }

        } else {
            return ({ success: false, status: 404, message: "El anuncio con el que desea generar el reporte no existe" });
        }

    };

    public static async edit({ name, location, imageUrl }: { name?: string, location?: string, imageUrl?: string }, UserId: string, idReport: string) {

        const UpdateReportSchema = z.object({
            name: z.string().optional(),
            location: z.string().optional(),
            imageUrl: z.string().optional(),
        });

        const auth_UserId = parseInt(UserId);
        const report = await Report.findByPk(idReport);

        if (report) {
            const report_UserId = report.get("UserId");

            if (report_UserId === auth_UserId) {
                report.update(UpdateReportSchema.parse({ idReport, name, location, imageUrl }));

                return ({ success: true, status: 200, message: "Reporte actualizado" })
            } else {
                return ({ success: false, status: 403, message: "El usuario que envió la solicitud no coincide con el usuario perteneciente a este reporte" });
            };
        } else {
            return ({ success: false, status: 404, message: "El reporte no existe" });
        };
    };

    public static async delete(id: string, UserId: string) {
        const report = await Report.findByPk(id);
        const auth_UserId = parseInt(UserId);
        if (report) {
            const report_UserId = report.get("UserId");
            if (report_UserId === auth_UserId) {
                await report.destroy();

                return ({ success: true, status: 200, message: messages.petDelete });

            } else {
                return ({ success: false, status: 403, message: messages.unauthorizedPet });
            };
        } else {
            return ({ success: false, status: 404, message: messages.petNotFound });
        };
    };
};

export default ReportController;