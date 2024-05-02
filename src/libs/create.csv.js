export class buildCsv {

    static formatData(studentData, tutorData) {

        const fecha = new Date(studentData.fechaNac);

        const fechaFormateada = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit' });

        studentData.fechaNac = fechaFormateada;

        studentData.matricula = studentData.alumno_id
        delete studentData.alumno_id;

        delete tutorData.correo;

        const data = { ...tutorData, ...studentData };

        if (data.hasOwnProperty('usuario_id')) {
            delete data.usuario_id;
        }

        return data;
    }

}