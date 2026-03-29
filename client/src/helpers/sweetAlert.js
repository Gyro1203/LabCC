import Swal from 'sweetalert2';

export async function deleteDataAlert() {
  return Swal.fire({
    title: "¿Estás seguro?",
    text: "¡No podrás revertir esto!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, eliminar!"
  })
}

export async function permanentDeleteAlert() {
  return Swal.fire({
    title: "ADVERTENCIA",
    text: "Eliminar el ingreso implica la eliminación de todas las actividades y asistencias asociadas a este. Una vez eliminados estos datos, no habrá forma de recuperarlos. ¿Estas seguro que deseas eliminarlo?",
    backdrop: 'rgba(220, 134, 53, 0.2)',
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Estoy seguro",
    confirmButtonColor: "#d33",
    cancelButtonText: "Cancelar",
    cancelButtonColor: "#404040",
  })
}

export const showSuccessAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'success'
  );
};

export const showErrorAlert = (titleMessage, message) => {
  Swal.fire(
    titleMessage,
    message,
    'error'
  );
};