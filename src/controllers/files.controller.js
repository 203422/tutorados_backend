import { TutorModel } from "../models/tutor.js";
import { StudentModel } from "../models/student.js";
import { buildPdf } from "../libs/create.pdf.js";
import { buildCsv } from "../libs/create.csv.js";
import fs from 'fs';
import fastcsv from 'fast-csv';

export class FilesControllers {

    static async createPdf(req, res) {

        const studentId = req.params.id;

        const studentData = await StudentModel.getStudentById({ studentId });
        if (studentData) {
            const tutorData = await TutorModel.getTutorById({ tutor_id: studentData.tutor_id })
            const stream = res.writeHead(200, {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename=${studentId}.pdf`
            })

            buildPdf.buildPdf((data) => stream.write(data),
                () => stream.end(), studentData, tutorData);
        }
    }

    static async createCsvPerStudent(req, res) {

        const studentId = req.params.id;

        const studentData = await StudentModel.getStudentById({ studentId });
        if (studentData) {
            const tutorData = await TutorModel.getTutorById({ tutor_id: studentData.tutor_id });
            const data = await buildCsv.formatData(studentData, tutorData);

            fastcsv.writeToString([data], { headers: true, encoding: 'utf8', lineDelimiter: '\r\n' })

                .then(csvString => {
                    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
                    res.attachment(`${studentId}.csv`);
                    res.send(csvString);
                })
                .catch(err => {
                    console.error('Error al generar el archivo CSV:', err);
                    res.status(500).json({ message: 'Error interno del servidor' });
                });

        }

    }

}