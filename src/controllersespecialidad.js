import Especialidad from "../models/Especialidad.js";

// Mostrar
export const getSpecialities = async (req, res) => {
    try {
        const specialities = await Especialidad.find();

        res.status(200).json(specialities);

    } catch (error) {
        res.status(500).json(error);
    }
};

// Crear
export const createSpeciality = async (req, res) => {
    try {
        const newSpeciality = new Especialidad(req.body);

        await newSpeciality.save();

        res.status(201).json({
            message: "Especialidad creada",
            newSpeciality
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

// Actualizar
export const updateSpeciality = async (req, res) => {
    try {
        const updated = await Especialidad.findByIdAndUpdate(
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
export const deleteSpeciality = async (req, res) => {
    try {
        await Especialidad.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Especialidad eliminada"
        });

    } catch (error) {
        res.status(500).json(error);
    }
};
