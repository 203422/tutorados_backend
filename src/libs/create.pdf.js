import PDFDocument from 'pdfkit';

export class buildPdf {

    static buildPdf(dataCallback, endCalback, studentData, tutorData) {
        // console.log(studentData)
        const doc = new PDFDocument({ size: 'letter' });

        doc.on('data', dataCallback)
        doc.on('end', endCalback)

        doc.image('./src/pdf/up_icon.jpg', 0, 0, { width: 118 })
        doc.image('./src/pdf/header_icon.png', 330, 15, { width: 260 })
        doc.image('./src/pdf/footer_icon.png', 180, 730, { width: 400 })

        doc.fontSize(16).font('Helvetica-Bold');
        doc.text('REGISTRO DE TUTORADO(A)', 200, 100)
        doc.fontSize(12).font('Helvetica');

        const studentImage = `./images/${studentData.imagen}`;
        doc.image(studentImage, 480, 170, { width: 85, height: 85 })
        .rect(480, 170, 85, 85)
        .stroke()

        doc.fontSize(14).font('Helvetica-Bold');
        doc.text('ESTUDIANTE', 130, 180);
        doc.moveDown(1);


        doc.fontSize(12).font('Helvetica');
        doc.font('Helvetica-Bold');
        doc.text('Nombre: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.nombre} ${studentData.apellido}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Programa académico: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.carrera}`);
        doc.font('Helvetica-Bold');
        doc.text('Matrícula: ', 130, 265, { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.usuario_id}`);
        doc.font('Helvetica-Bold',);
        doc.text('Edad: ', 250, 265, { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.edad}`);
        doc.font('Helvetica-Bold');
        doc.text('Género: ', 130, 291, { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.genero}`);
        doc.font('Helvetica-Bold');
        doc.text('Religión: ', 250, 291, { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.religion}`);
        doc.font('Helvetica-Bold');
        doc.text('Fecha de nacimiento: ', 130, 317, { continued: true });
        doc.font('Helvetica');
        const fecha = new Date(studentData.fechaNac);
        const fechaFormateada = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });
        doc.text(fechaFormateada);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Lugar de nacimiento: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.lugarNac}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Actividad deportiva o cultural: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.actividad}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Tutor o padre de familia: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.tutor_padre}`);

        //Contacto
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text('DATOS DE CONTACTO');
        doc.moveDown(1);

        doc.fontSize(12).font('Helvetica');
        doc.font('Helvetica-Bold');
        doc.text('Domicilio actual: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.domicilio_actual}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Domicilio familiar: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.domicilio_familiar}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Celular: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.celular}`);
        doc.font('Helvetica-Bold');
        doc.text('Teléfono de casa: ', 265, 516, { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.tel_casa}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Correo electrónico: ', 130, 542, { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.correo}`);
        doc.font('Helvetica-Bold');
        doc.moveDown(.8);
        doc.text('Correo del tutor o padre de familia: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.correo_tutor}`);

        //Datos socioeconomicos
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text('DATOS SOCIOECONÓMICOS');
        doc.moveDown(1);

        doc.fontSize(12).font('Helvetica');
        doc.font('Helvetica-Bold');
        doc.text('Trabajo actual: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.trabajo}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Cuenta con apoyo económico: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.apoyo_economico}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Actualmente vive con: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.convivencia}`);

        doc.addPage();

        doc.image('./src/pdf/up_icon.jpg', 0, 0, { width: 118 })
        doc.image('./src/pdf/header_icon.png', 330, 15, { width: 260 })
        doc.image('./src/pdf/footer_icon.png', 180, 730, { width: 400 })

        //Datos medicos
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text('DATOS MÉDICOS', 130, 100);
        doc.moveDown(1);

        doc.fontSize(12).font('Helvetica');
        doc.font('Helvetica-Bold');
        doc.text('Número de seguro social: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.num_seguro}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Tipo de sangre: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.tipo_sangre}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Enfermedad: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.enfermedad}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Discapacidad: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.discapacidad}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Alergia: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.alergia}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Consumo de sustancias tóxicas: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.sustancias_toxicas}`);

        //Datos academicos
        doc.moveDown(2);
        doc.fontSize(14).font('Helvetica-Bold');
        doc.text('DATOS ACADÉMICOS');
        doc.moveDown(1);

        doc.fontSize(12).font('Helvetica');
        doc.font('Helvetica-Bold');
        doc.text('Preparatoria de origen: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.preparatoria}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Promedio general: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.promedio}`);
        doc.moveDown(.8);
        doc.font('Helvetica-Bold');
        doc.text('Puntuación de examen CENEVAL: ', { continued: true });
        doc.font('Helvetica');
        doc.text(`${studentData.puntuacion_ceneval}`);

        //firmas

        doc.font('Helvetica-Bold')
        doc.text('_______________________', 130, 500,)

        doc.text(`${tutorData.nombre} ${tutorData.apellido}`, 140, 520);
        doc.text('Tutor(a) Académico', 150)



        doc.text('_______________________', 370, 500, { align: 'center' })
        doc.text(`${studentData.nombre} ${studentData.apellido}`, 370, 520, { align: 'center' })
        doc.text('Tutorado(a)', { align: 'center' })


        doc.end();

    }

}