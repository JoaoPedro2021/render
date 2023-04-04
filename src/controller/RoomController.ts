import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helpers/api-error";
import { roomRepository } from "../repositories/roomRepository";
import { subjectRepository } from "../repositories/subjectRepository";
import { videoRepository } from "../repositories/videoRepository";

export class RoomController {
    async create(req: Request, res: Response) {
        const { name, description } = req.body;
        const newRoom = roomRepository.create({ name, description })

        await roomRepository.save(newRoom);

        return res.status(201).json(newRoom);
    }

    async createVideo(req: Request, res: Response) {
        const { title, url } = req.body;
        const { idRoom } = req.params;
        const room = await roomRepository.findOneBy({ id: Number(idRoom) })

        if (!room) {
            throw new NotFoundError("Room not found")
        }

        const newVideo = videoRepository.create({
            title,
            url,
            room
        });

        await videoRepository.save(newVideo)

        return res.status(201).json(newVideo)
    }


    async roomSubject(req: Request, res: Response) {
        const { subject_id } = req.body;
        const { idRoom } = req.params;

        const room = await roomRepository.findOneBy({ id: Number(idRoom) })

        if (!room) {
            throw new NotFoundError("Room not found")
        }

        const subject = await subjectRepository.findOneBy({ id: Number(subject_id) })

        if (!subject) {
            throw new NotFoundError("Subject not found")

        }

        const roomUpdate = {
            ...room,
            subjects: [subject]
        }

        console.log(roomUpdate)

        await roomRepository.save(roomUpdate)

        return res.status(204).send()
    }

    async list(req: Request, res: Response) {
        const rooms = await roomRepository.find({
            relations: {
                subjects: true
            }
        })
        return res.json(rooms)

    }

    async listId(req: Request, res: Response) {
        const { idRoom } = req.params
        const rooms = await roomRepository.find({
            where: {
                id: Number(idRoom)
            },
            relations: {
                subjects: true
            }
        })
        return res.json(rooms)

    }
}