import Estudiante from "../models/Estudiante.js";

// Mostrar estudiantes
export const getStudents = async (req, res) => {
   try {
       const students = await Estudiante.find()
           .populate("speciality_id");

       res.status(200).json(students);

   } catch (error) {
       res.status(500).json({
           message: "Error obteniendo estudiantes",
           error
       });
   }
};

// Obtener uno
export const getStudentById = async (req, res) => {
   try {
       const student = await Estudiante.findById(req.params.id);

       if (!student) {
           return res.status(404).json({
               message: "Estudiante no encontrado"
           });
       }

       res.status(200).json(student);

   } catch (error) {
       res.status(500).json(error);
   }
};

// Crear
export const createStudent = async (req, res) => {
   try {
       const newStudent = new Estudiante(req.body);

       await newStudent.save();

       res.status(201).json({
           message: "Estudiante creado correctamente",
           newStudent
       });

   } catch (error) {
       res.status(500).json(error);
   }
};

// Actualizar
export const updateStudent = async (req, res) => {
   try {
       const updatedStudent = await Estudiante.findByIdAndUpdate(
           req.params.id,
           req.body,
           { new: true }
       );

       res.status(200).json({
           message: "Estudiante actualizado",
           updatedStudent
       });

   } catch (error) {
       res.status(500).json(error);
   }
};

// Eliminar
export const deleteStudent = async (req, res) => {
   try {
       await Estudiante.findByIdAndDelete(req.params.id);

       res.status(200).json({
           message: "Estudiante eliminado"
       });

   } catch (error) {
       res.status(500).json(error);
   }
};
