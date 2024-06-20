import React, { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import { GraphQlInputEvents } from "../../../graphql/GraphQlEvents";
import Alert from "../../../components/Alert";
import dayjs from "dayjs";
import WYSIWYG from "../../../components/WYSIWYG";

export default function AddEvents() {
  const jenisProgram = [
    "Concert",
    "Choir Humanity Action",
    "Newcomers Concert",
    "Goes To School",
    "Competition",
  ];

  const [isAlert, setIsAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");

  const openAlert = (variant, message) => {
    setIsAlert(true);
    setVariant(variant);
    setMessage(message);
    setTimeout(closeAlert, 2500);
  };
  const closeAlert = () => {
    setIsAlert(false);
    setVariant("");
    setMessage("");
  };

  const [images, setImages] = useState("");

  const { AddEvents, loading, error } = GraphQlInputEvents();

  const formik = useFormik({
    initialValues: {
      header_image: null,
      title: "",
      content: "",
      link: null,
      documentation: null,
      program_name: "",
      start_date: "",
    },
    validationSchema: Yup.object({
      title: Yup.string().required("Tolong Masukkan Judul Program!!"),
      content: Yup.string().required("Tolong Masukkan Deskripsi Program!!"),
      program_name: Yup.string().required("Tolong Masukkan Jenis Program!!"),
      start_date: Yup.string().required("Tolong Masukkan Jenis Program!!"),
    }),
    onSubmit: async () => {
      await AddEvents({
        variables: {
          object: {
            header_image: formik.values.header_image,
            title: formik.values.title,
            content: formik.values.content,
            link: formik.values.link,
            documentation: formik.values.documentation,
            program_name: formik.values.program_name,
            start_date: dayjs(formik.values.start_date),
          },
        },
      });
      openAlert("success", "Data Baru Berhasil Ditambahkan!!!");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    },
  });

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "gdnofficial");
    data.append("cloud_name", "dpfzxkihs");
    await fetch("https://api.cloudinary.com/v1_1/dpfzxkihs/image/upload", {
      method: "post",
      body: data,
    })
      .then(async (resp) => await resp.json())
      .then((data) => {
        formik.values.header_image = data.url;
      })
      .catch((err) => openAlert("error", err));
  };

  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((file) => {
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (e) => {
        // Do whatever you want with the file contents
        const binaryStr = reader.result;
        setImages(e.target.result);
        uploadImage(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    accept: {
      "displayImage/jpeg": [".jpeg", ".png", ".jpg"],
      "displayImage/jpg": [],
      "displayImage/png": [],
    },
    onDropRejected: () => {
      openAlert("danger", "file tidak memenuhi standard yang diberikan");
    },
  });

  const getDataFromChild = async(dialog) =>{
    await formik.setFieldValue("content", dialog);
  }

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="relative">
        {images ? (
          <div className="relative w-full h-[fit] my-6">
            <img
              className="bg-transparent rounded-3xl object-cover w-full h-[300px]"
              src={images}
              alt="card-image"
            />
            <div className="w-full flex my-3 justify-center">
              <a
                onClick={open}
                className="cursor-pointer justify-center text-p3 mb-3 w-fit px-6 inline-block bg-green-700 rounded-full py-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] disabled:bg-green-300"
              >
                Edit Image
              </a>
            </div>
          </div>
        ) : (
          <div className="relative w-full my-6">
            <label
              id="dropContainer"
              {...getRootProps({ className: "dropzone" })}
              className="flex text-p2 w-full py-20 h-fit items-center rounded-3xl border border-gray-300 border-dashed bg-gray-300"
            >
              <div className="flex-wrap text-center w-full">
                <button className="bg-gray-50 rounded-full p-3 cursor-default">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z"
                    />
                  </svg>
                </button>
                <div className="space-y-2 ">
                  <input {...getInputProps()} type="file" hidden />
                  <label
                    className="text-base text-green-500 font-semibold cursor-pointer"
                    onClick={open}
                  >
                    Klik untuk Mengunggah
                  </label>
                  <span className="text-sm text-gray-500">
                    {" "}
                    atau seret dan lepas
                  </span>
                </div>
                <div className="space-y-2 ">
                  <span className="text-sm text-gray-500">
                    PNG, atau JPG (maks. 640x312px)
                  </span>
                </div>
              </div>
            </label>
            <div className="w-full flex my-3 justify-center">
              <a
                onClick={open}
                className="cursor-pointer justify-center text-p3 mb-3 w-fit px-6 inline-block bg-blue-700 rounded-full py-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] disabled:bg-green-300"
              >
                Upload Image
              </a>
            </div>
          </div>
        )}

        <div className="w-full">
          <div className="my-6">
            <label
              for="success"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Judul Program
            </label>
            <input
              type="text"
              id="title"
              className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              placeholder="Judul Program"
              value={formik.values.title}
              onChange={formik.handleChange}
            />
            {formik.errors.title && formik.touched.title && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.title}
              </div>
            )}
          </div>

          <div className="my-6 w-full h-fit">
            <label
              for="success"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Isi
            </label>
            <WYSIWYG sendDataToParent={getDataFromChild} Values={"<p>Masukkan Content</p>"}/>
            {formik.errors.content && formik.touched.content && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.content}
              </div>
            )}
          </div>

          <div className="my-6">
            <label
              for="success"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Link Pembelian Tiket
            </label>
            <input
              type="text"
              id="link"
              className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              placeholder="Link Pembelian Tiket (bila tersedia untuk umum)"
              value={formik.values.link}
              onChange={formik.handleChange}
            />
            {formik.errors.link && formik.touched.link && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.link}
              </div>
            )}
          </div>
        </div>
      </div>

      <div>
        <label
          for="default"
          className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
        >
          Jenis Program
        </label>
        <select
          id="program_name"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formik.values.program_name}
          onChange={formik.handleChange}
        >
          <option value="">Pilih Jenis Program</option>
          {jenisProgram.map((item) => (
            <option value={item}>{item}</option>
          ))}
        </select>
        {formik.errors.program_name && formik.touched.program_name && (
          <div className="text-red-500 text-sm ms-2 mt-2">
            {formik.errors.program_name}
          </div>
        )}
      </div>

      <div className="my-6">
        <label
          for="success"
          className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
        >
          Waktu Pengadaan Event
        </label>
        <input
          type="datetime-local"
          id="start_date"
          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          value={formik.values.start_date}
          onChange={formik.handleChange}
        />
        {formik.errors.start_date && formik.touched.start_date && (
          <div className="text-red-500 text-sm ms-2 mt-2">
            {formik.errors.start_date}
          </div>
        )}
      </div>

      <div className="flex w-full mt-6 justify-end ">
        {/*Submit button*/}
        <div className="text-center">
          {loading ? (
            <button
              id="btn_add_product"
              className="text-p3 ms-3 mb-3 w-fit px-6 inline-block bg-blue-700 rounded-full py-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] disabled:bg-blue-400"
              type="submit"
              data-te-ripple-init=""
              disabled={!formik.dirty}
            >
              Simpan
            </button>
          ) : (
            <a
              disabled
              type="button"
              className="text-p3 ms-3 mb-3 w-fit px-6 inline-block bg-blue-700 rounded-full py-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] disabled:opacity-75"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="inline w-4 h-4 me-3 text-white animate-spin"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Loading...
            </a>
          )}
        </div>
      </div>
      {isAlert && (
        <Alert variant={variant} message={message} onClose={closeAlert} />
      )}
    </form>
  );
}
