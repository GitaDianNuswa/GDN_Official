import React, { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  GraphQlUsers,
  GraphQLUpdateUsersById,
} from "../../../graphql/GraphQlUsers";
import Alert from "../../../components/Alert";
import { useNavigate, useParams } from "react-router-dom";

export default function EditUsers() {
  const { id } = useParams();
  const { data, loading, error } = GraphQlUsers();
  const navigate = useNavigate();

  const [isAlert, setIsAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState("");

  const [images, setImages] = useState("");
  const [url, setUrl] = useState("");
  const { UpdateUsers, LoadingUsers, DeleteUsers } = GraphQLUpdateUsersById();

  useEffect(() => {
    if (data) {
      const user = data?.users.filter((element) => element.id == id);
      const dataInialisasi = {
        name: user[0].name,
        email: user[0].email,
        password: user[0].password,
        voice_type: user[0].voice_type,
        position: user[0].position,
        angkatan: user[0].angkatan,
        instagram: user[0].instagram,
        facebook: user[0].facebook,
        twitter: user[0].twitter,
      };
      setUrl(user[0].image);
      setImages(user[0].image);
      formik.setValues(dataInialisasi);
      console.log("loop");
    }
  }, [data]);
  if (error) return <ErrorPage />;

  const jenisSuara = [
    "Sopran 1",
    "Sopran 2",
    "Alto 1",
    "Alto 2",
    "Tenor 1",
    "Tenor 2",
    "Bass 1",
    "Bass 2",
  ];
  const posisi = [
    "Ketua",
    "Wakil Ketua",
    "Bendahara 1",
    "Bendahara 2",
    "Sekretaris 1",
    "Sekretaris 2",
    "Koordinator Humas",
    "Humas Internal",
    "Humas Eksternal",
    "Koordinator Kepelatihan",
    "Kepelatihan",
    "Koordinator Dana Usaha",
    "Dana Usaha",
    "Koordinator Inventaris",
    "Perkab",
    "Estetika",
    "Koordinator Publikasi",
    "Kreatif",
    "Publikasi",
    "Anggota",
  ];

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

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      voice_type: "",
      position: "",
      angkatan: "",
      instagram: null,
      facebook: null,
      twitter: null,
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Tolong Masukkan Nama Lengkap!!"),
      email: Yup.string()
        .email("Email Tidak Valid")
        .required("Tolong Masukkan Alamat Email!!"),
      password: Yup.string().required("Tolong Masukkan Password!!"),
      voice_type: Yup.string().required("Tolong Masukkan Jenis Suara!!"),
      position: Yup.string().required("Tolong Masukkan Posisi!!"),
      angkatan: Yup.string().required("Tolong Masukkan Angkatan Masuk!!"),
    }),
    onSubmit: async () => {
      await UpdateUsers({
        variables: {
          id: id,
          object: {
            image: url,
            name: formik.values.name,
            email: formik.values.email,
            password: formik.values.password,
            voice_type: formik.values.voice_type,
            position: formik.values.position,
            angkatan: formik.values.angkatan,
            status: true,
            instagram: formik.values.instagram,
            facebook: formik.values.facebook,
            twitter: formik.values.twitter,
          },
        },
      });
      openAlert("success", "Data Berhasil Diubah!!!");
      setTimeout(() => {
        navigate("/admin");
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
        setUrl(data.url);
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

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="lg:flex relative">
        {images ? (
          <div className="relative lg:w-4/12 lg:h-auto sm:h-[100px] sm:w-[100px] my-6">
            <img
              className="bg-transparent aspect-square rounded-full object-cover w-full"
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
          <div className="relative lg:w-4/12 w-full my-6">
            <label
              id="dropContainer"
              {...getRootProps({ className: "dropzone" })}
              className="flex text-p2 w-full py-40 h-[100px] items-center rounded-3xl border border-gray-300 border-dashed bg-gray-300"
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

        <div className="lg:w-8/12 lg:mx-3 w-full">
          <div className="my-6">
            <label
              for="success"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Nama Anggota
            </label>
            <input
              type="text"
              id="name"
              className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              placeholder="Nama Lengkap"
              value={formik.values.name}
              onChange={formik.handleChange}
            />
            {formik.errors.name && formik.touched.name && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.name}
              </div>
            )}
          </div>

          <div className="my-6">
            <label
              for="success"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
            {formik.errors.email && formik.touched.email && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.email}
              </div>
            )}
          </div>

          <div className="my-6">
            <label
              for="success"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
              placeholder="*********"
              value={formik.values.password}
              onChange={formik.handleChange}
            />
            {formik.errors.password && formik.touched.password && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.password}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 justify-around w-full gap-6">
        <div>
          <label
            for="default"
            className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
          >
            Jenis Suara
          </label>
          <select
            id="voice_type"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formik.values.voice_type}
            onChange={formik.handleChange}
          >
            <option value="">Pilih Jenis Suara</option>
            {jenisSuara.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
          {formik.errors.voice_type && formik.touched.voice_type && (
            <div className="text-red-500 text-sm ms-2 mt-2">
              {formik.errors.voice_type}
            </div>
          )}
        </div>
        <div>
          <label
            for="default"
            className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
          >
            Devisi
          </label>
          <select
            id="position"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formik.values.position}
            onChange={formik.handleChange}
          >
            <option value="">Pilih Devisi</option>
            {posisi.map((item) => (
              <option value={item}>{item}</option>
            ))}
          </select>
          {formik.errors.position && formik.touched.position && (
            <div className="text-red-500 text-sm ms-2 mt-2">
              {formik.errors.position}
            </div>
          )}
        </div>
        <div>
          <label
            for="default"
            className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
          >
            Angkatan
          </label>
          <select
            id="angkatan"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={formik.values.angkatan}
            onChange={formik.handleChange}
          >
            <option value="">Pilih Angkatan Masuk</option>
            <option value={new Date().getFullYear()}>
              {new Date().getFullYear()}
            </option>
            <option value={new Date().getFullYear() - 1}>
              {new Date().getFullYear() - 1}
            </option>
            <option value={new Date().getFullYear() - 2}>
              {new Date().getFullYear() - 2}
            </option>
            <option value={new Date().getFullYear() - 3}>
              {new Date().getFullYear() - 3}
            </option>
          </select>
          {formik.errors.angkatan && formik.touched.angkatan && (
            <div className="text-red-500 text-sm ms-2 mt-2">
              {formik.errors.angkatan}
            </div>
          )}
        </div>
      </div>

      <div className="mt-3">
        <label
          for="success"
          className="block mb-2 text-sm font-medium text-green-700 dark:text-green-500"
        >
          URL Instagram (opsional)
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-white bg-blue-700 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            id="instagram"
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="https://instagram/your-account-name"
          />
        </div>
      </div>

      <div className="mt-3">
        <label
          for="success"
          className="block mb-2 text-sm font-medium text-green-700 dark:text-green-500"
        >
          URL Facebook (opsional)
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-white bg-blue-700 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <input
            type="text"
            id="facebook"
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="https://web.facebook/your-account-name"
          />
        </div>
      </div>

      <div className="mt-3">
        <label
          for="success"
          className="block mb-2 text-sm font-medium text-green-700 dark:text-green-500"
        >
          URL Twitter (opsional)
        </label>
        <div className="flex">
          <span className="inline-flex items-center px-3 text-sm text-white bg-blue-700 border rounded-e-0 border-gray-300 rounded-s-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
            <svg
              className="h-6 w-6"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
            </svg>
          </span>
          <input
            type="text"
            id="twitter"
            className="rounded-none rounded-e-lg bg-gray-50 border text-gray-900 focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="https://twitter.com/your-account-name"
          />
        </div>
      </div>
      <div className="flex w-full mt-6 justify-end ">
        {/*Submit button*/}
        <div className="text-center">
          <button
            id="btn_add_product"
            className="text-p3 ms-3 mb-3 w-fit px-6 inline-block bg-blue-700 rounded-full py-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_rgba(0,0,0,0.2)] transition duration-150 ease-in-out hover:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] focus:outline-none focus:ring-0 active:shadow-[0_8px_9px_-4px_rgba(0,0,0,0.1),0_4px_18px_0_rgba(0,0,0,0.2)] disabled:bg-green-300"
            type="submit"
            data-te-ripple-init=""
            disabled={!formik.dirty}
          >
            Ubah
          </button>
        </div>
      </div>
      {isAlert && (
        <Alert variant={variant} message={message} onClose={closeAlert} />
      )}
    </form>
  );
}
