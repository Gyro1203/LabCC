function Filter(data, filterText, camposFiltro) {
    
  const filtrado = data.filter((a) =>
    camposFiltro.some((campo) =>
      (a[campo] || "")
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(
          filterText
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
        )
    )
  );

  return filtrado;

}

export default Filter;