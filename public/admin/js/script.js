//Button Status
const buttonStatus = document.querySelectorAll('[button-status]')
if (buttonStatus.length > 0) {
  let url = new URL(window.location.href);

  buttonStatus.forEach((button) => {
    button.addEventListener('click', () => {
      const status = button.getAttribute('button-status');
      if (status) {
        url.searchParams.set('status', status);
      } else {
        url.searchParams.delete('status');
      }

      window.location.href = url.href;
    });
  });
}
//End Button Status

//Form Search
const formSearch = document.querySelector('#form-search');
if (formSearch) {
  let url = new URL(window.location.href);
  formSearch.addEventListener('submit', (e) => {
    e.preventDefault();
    const keyword = e.target.elements.keyword.value;
    if (keyword) {
      url.searchParams.set('keyword', keyword);
    } else {
      url.searchParams.delete('keyword');
    }

    window.location.href = url.href;
  });
}
//End Form Search

//Pagination
const buttonPagination = document.querySelectorAll("[button-pagination]")
if (buttonPagination.length > 0) {
  let url = new URL(window.location.href);

  buttonPagination.forEach(button => {
    button.addEventListener('click', () => {
      const page = button.getAttribute("button-pagination")
      url.searchParams.set('page', page);
      window.location.href = url.href
    })
  })
}
//End Pagination

//button-change-status
const buttonChangeStatus = document.querySelectorAll("[button-change-status]")
if (buttonChangeStatus.length > 0) {
  const formChangeStatus = document.querySelector('[form-change-status]');
  const path = formChangeStatus.getAttribute('data-path');
  buttonChangeStatus.forEach(button => {
    button.addEventListener('click', () => {
      const statusCurrent = button.getAttribute('data-status');
      const id = button.getAttribute('data-id');

      const statusChange = statusCurrent == "active" ? "inactive" : "active";
      const action = `${path}/${statusChange}/${id}?_method=PATCH`;

      formChangeStatus.action = action;
      formChangeStatus.submit();
    })
  })
}
//End button-change-status

//checkbox-multi
const checkboxMulti = document.querySelector('[checkbox-multi]');
if (checkboxMulti) {
  const inputCheckAll = checkboxMulti.querySelector("input[name='checkall']")
  const inputsId = checkboxMulti.querySelectorAll("input[name='id']")

  inputCheckAll.addEventListener('click', () => {
    if (inputCheckAll.checked) {
      inputsId.forEach(input => {
        input.checked = true;
      });
    } else {
      inputsId.forEach(input => {
        input.checked = false;
      });
    }
  })

  inputsId.forEach(input => {
    input.addEventListener('click', () => {
      const countChecked = checkboxMulti.querySelectorAll("input[name='id']:checked").length;

      if (countChecked == inputsId.length) {
        inputCheckAll.checked = true;
      } else {
        inputCheckAll.checked = false;
      }
    })
  })
}
//End checkbox-multi

//form-change-multi
const formChangeMulti = document.querySelector('[form-change-multi]');
if (formChangeMulti) {
  formChangeMulti.addEventListener('submit', (e) => {
    e.preventDefault();

    const type = e.target.elements.type.value;
    if (type == 'delete-all') {
      const isConfirm = confirm('Bạn có chắc chắn muốn xóa những bản ghi này ?');
      if (!isConfirm) {
        return;
      }
    }

    const inputIdChecked = document.querySelectorAll("input[name='id']:checked");

    if (inputIdChecked.length > 0) {
      const ids = [];

      const inputIds = formChangeMulti.querySelector("input[name='ids']");

      inputIdChecked.forEach(input => {
        const id = input.value;
        if (type == 'change-position') {
          const position = input.closest("tr").querySelector("input[name='position']").value;

          ids.push(`${id}-${position}`)
        } else {
          ids.push(id)
        }
      })

      inputIds.value = ids.join(", ");
      console.log(inputIds.value)
      formChangeMulti.submit()
    } else {
      alert("Bạn phải nhập ít nhất 1 bản ghi")
    }
  })
}
//End form-change-multi

//Delete Item
const buttonsDelete = document.querySelectorAll('[button-delete]');
if (buttonsDelete.length > 0) {
  const formDeleteItem = document.querySelector('[form-delete-item]');
  const path = formDeleteItem.getAttribute("data-path");

  buttonsDelete.forEach(button => {
    button.addEventListener('click', () => {
      const isConfirm = confirm('Bạn có chắc muốn xóa bản ghi này không?');

      if (isConfirm) {
        const id = button.getAttribute('data-id');

        const action = `${path}/${id}?_method=DELETE`;

        formDeleteItem.action = action;
        formDeleteItem.submit();
      }
    })
  })
}
//End Delete Item

//Show Alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
  const time = parseInt(showAlert.getAttribute('data-time'));
  setTimeout(() => {
    showAlert.classList.add("alert-hidden");
  }, time)

  const closeAlert = showAlert.querySelector('[close-alert]');
  closeAlert.addEventListener('click', () => {
    showAlert.classList.add("alert-hidden");
  })
}
//End Show Alert

// Preview Image
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
  const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
  const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");

  uploadImageInput.addEventListener("change", (event) => {
    const [file] = uploadImageInput.files;
    if (file) {
      uploadImagePreview.src = URL.createObjectURL(file);
    }
  });
}
// End Preview Image

//Sort
const sort = document.querySelector('[sort]');
if (sort) {
  let url = new URL(window.location.href)
  const sortSelect = sort.querySelector('[sort-select]')
  const sortClear = sort.querySelector('[sort-clear]')

  //Sắp xếp
  sortSelect.addEventListener('change', () => {
    const [sortKey, sortValue] = sortSelect.value.split('-')

    url.searchParams.set("sortKey", sortKey);
    url.searchParams.set("sortValue", sortValue);

    window.location.href = url.href;
  })

  //Xóa sắp xếp
  sortClear.addEventListener('click', () => {
    url.searchParams.delete("sortKey");
    url.searchParams.delete("sortValue");

    window.location.href = url.href;
  })

  //Thêm thẻ selected cho option
  const sortKey = url.searchParams.get('sortKey');
  const sortValue = url.searchParams.get('sortValue');

  if (sortKey && sortValue) {
    const string = `${sortKey}-${sortValue}`
    const optionSelected = sort.querySelector(`option[value='${string}']`)
    optionSelected.selected = true
  }
}
//End Sort