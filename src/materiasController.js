import Materias from "../models/Materias.js";

// Mostrar
export const getSubjects = async (req, res) => {
    try {
        const subjects = await Materias.find()
            .populate("teacher_id")
            .populate("speciality_id");

        res.status(200).json(subjects);

    } catch (error) {
        res.status(500).json(error);
    }
};

// Crear
export const createSubject = async (req, res) => {
    try {
        const newSubject = new Materias(req.body);

        await newSubject.save();

        res.status(201).json({
            message: "Materia creada",
            newSubject
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

// Actualizar
export const updateSubject = async (req, res) => {
    try {
        const updated = await Materias.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updated);

    } catch (error) {
        res.status(500).json(error);
    }
};

// Eliminar
export const deleteSubject = async (req, res) => {
    try {
        await Materias.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Materia eliminada"
        });

    } catch (error) {
        res.status(500).json(error);
    }
};
