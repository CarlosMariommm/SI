import Pagos from "../models/Pagos.js";

// Mostrar
export const getPayments = async (req, res) => {
    try {
        const payments = await Pagos.find()
            .populate("student_id");

        res.status(200).json(payments);

    } catch (error) {
        res.status(500).json(error);
    }
};

// Crear
export const createPayment = async (req, res) => {
    try {
        const newPayment = new Pagos(req.body);

        await newPayment.save();

        res.status(201).json({
            message: "Pago registrado",
            newPayment
        });

    } catch (error) {
        res.status(500).json(error);
    }
};

// Actualizar
export const updatePayment = async (req, res) => {
    try {
        const updated = await Pagos.findByIdAndUpdate(
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
export const deletePayment = async (req, res) => {
    try {
        await Pagos.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "Pago eliminado"
        });

    } catch (error) {
        res.status(500).json(error);
    }
};
