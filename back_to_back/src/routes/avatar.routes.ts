import { FastifyInstance } from "fastify";
import fs from "fs";
import path from "path";
import { pipeline } from "node:stream/promises";
import { prisma } from "../middleware/prisma.js";
import { verifToken2FA } from "../middleware/auth";

const MAX_AVATAR_BYTES = 2 * 1024 * 1024; // 2MB
const ALLOWED_MIME = new Set(["image/jpeg", "image/png", "image/webp"]);

export default async function avatarRoutes(app: FastifyInstance) {
    // Protège toutes les routes de ce plugin
    app.addHook("preHandler", verifToken2FA);

    // POST /profile/avatar : upload avatar
    app.post("/profile/avatar", async (request, reply) => {
        const userId = (request.user as any)?.userId as number | undefined;
        if (!userId) return reply.status(401).send({ error: "Unauthorized" });

        const part = await request.file({
            limits: {
                fileSize: MAX_AVATAR_BYTES,
                files: 1,
            },
        });

        if (!part) return reply.status(400).send({ error: "Missing file 'avatar'" });
        if (part.fieldname !== "avatar") {
            return reply.status(400).send({ error: "Expected field name 'avatar'" });
        }

        if (!ALLOWED_MIME.has(part.mimetype)) {
            return reply.status(400).send({ error: "Unsupported file type" });
        }

        const ext =
            part.mimetype === "image/png"
                ? ".png"
                : part.mimetype === "image/webp"
                    ? ".webp"
                    : ".jpeg";

        const uploadDir = path.resolve("/app/back_to_back/avatar");
        if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

        const uniqueFilename = `${userId}-${Date.now()}${ext}`;
        const finalPath = path.join(uploadDir, uniqueFilename);

        try {
            await pipeline(part.file, fs.createWriteStream(finalPath));
        } catch (error) {
            request.log.error({ err: error }, "Avatar upload failed");
            return reply.status(500).send({ error: "Échec de l'upload de l'image" });
        }

        const avatarUrl = `/avatar/${uniqueFilename}`;

        try {
            const user = await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl },
                select: { id: true, username: true, email: true, avatarUrl: true },
            });

            return reply.send({ message: "Avatar mis à jour", user });
        } catch (error) {
            request.log.error({ err: error }, "Avatar DB update failed");
            return reply.status(500).send({ error: "Erreur lors de la mise à jour" });
        }
    });

    // DELETE /profile/avatar : reset avatar
    app.delete("/profile/avatar", async (request, reply) => {
        const userId = (request.user as any)?.userId as number | undefined;
        if (!userId) return reply.status(401).send({ error: "Unauthorized" });

        try {
            // Récupère l'ancien avatar pour éventuellement supprimer le fichier
            const current = await prisma.user.findUnique({
                where: { id: userId },
                select: { avatarUrl: true },
            });

            const user = await prisma.user.update({
                where: { id: userId },
                data: { avatarUrl: null },
                select: { id: true, username: true, email: true, avatarUrl: true },
            });

            // Optionnel: supprimer le fichier sur disque (best-effort)
            const old = current?.avatarUrl;
            if (old && old.startsWith("/avatar/")) {
                const oldFilename = old.replace("/avatar/", "");
                const oldPath = path.join(path.resolve("/app/back_to_back/avatar"), oldFilename);
                fs.promises.unlink(oldPath).catch(() => {});
            }

            return reply.send({ message: "Avatar réinitialisé", user });
        } catch (error) {
            request.log.error({ err: error }, "Avatar reset failed");
            return reply.status(500).send({ error: "Erreur lors de la réinitialisation" });
        }
    });
}