import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-error";
import { subjectRepository } from "../repositories/subjectRepository";


export class SubjectController {
    // Criar uma subject(disciplina)
    async create(req: Request, res: Response) {
        const { name } = req.body;

        if (!name) {
            throw new BadRequestError("Name is required")
        }

        const newSubject = subjectRepository.create({ name })

        await subjectRepository.save(newSubject)

        return res.status(201).json(newSubject)

    }
}