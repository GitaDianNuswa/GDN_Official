import { useState } from "react";
import { GraphQlInputRank } from "../../../graphql/GraphQlRank";
import { GraphQlUsers } from "../../../graphql/GraphQlUsers";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import Alert from "../../../components/Alert";
import { useParams } from "react-router-dom";
import { GraphQlCompetition } from "../../../graphql/GraphQlCompetition";
import { GraphQlKategory } from "../../../graphql/GraphQlKategory";
import { GraphQlRank } from "../../../graphql/GraphQlRank";

export default function AddRank() {
  const navigate = useNavigate();
  const { competitionId } = useParams();
  const { data, loading, error } = GraphQlUsers();
  const { dataRank, loadingRank, errorRank } = GraphQlRank();
  const { AddRank, Addloading, Adderror } = GraphQlInputRank();
  const { dataKategory } = GraphQlKategory()

  const dataNama = data?.users.filter((User) => {
    if (User.name !== "Admin") {
      const allRank = dataRank?.rank.filter((Rank) => Rank.competitionId == competitionId)
      const matchFound = allRank?.some(
        (Ranking) => User.id === Ranking.userId
      );

      return !matchFound;
    }
  });

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

  const formik = useFormik({
    initialValues: {
      id: "",
      support: "",
      placement: "",
      ruangan: "",
      keaktifan: "",
    },
    validationSchema: Yup.object({
      id: Yup.string().required("Pilih Orang yang akan dinilai!!"),
      support: Yup.number()
        .min(0, "Nilai Tidak Boleh Negatif")
        .max(100, "Nilai Tidak Boleh Melebihi 100")
        .required("Nilai Kosong"),
      placement: Yup.number()
        .min(0, "Nilai Tidak Boleh Negatif")
        .max(100, "Nilai Tidak Boleh Melebihi 100")
        .required("Nilai Kosong"),
      ruangan: Yup.number()
        .min(0, "Nilai Tidak Boleh Negatif")
        .max(100, "Nilai Tidak Boleh Melebihi 100")
        .required("Nilai Kosong"),
      keaktifan: Yup.number()
        .min(0, "Nilai Tidak Boleh Negatif")
        .max(100, "Nilai Tidak Boleh Melebihi 100")
        .required("Nilai Kosong"),
    }),
    onSubmit: async () => {
      const userIdentity = formik.values.id.split("!");

      const nilai = CalculatePrefvalue(
        formik.values.support,
        formik.values.placement,
        formik.values.ruangan,
        formik.values.keaktifan
      );
      await AddRank({
        variables: {
          object: {
            userId: userIdentity[0],
            name: userIdentity[1],
            voice_Type: userIdentity[2],
            competitionId: competitionId,
            support: formik.values.support,
            placement: formik.values.placement,
            ruangan: formik.values.ruangan,
            keaktifan: formik.values.keaktifan,
            nilai: nilai,
          },
        },
      });
      openAlert("success", "Data Berhasil DiTambahkan!!!");
      setTimeout(() => {
        navigate("/admin/rank");
      }, 2000);
    },
  });

  
  const weight = dataKategory?.kategori.filter((element) => "weight" in element)
  const ArrayWeight = weight?.map(item => item["weight"]);

  const CalculatePrefvalue = (support, placement, ruangan, keaktifan) => {
    // Normalisasi Matriks keputusan
    const ValueList = [support, placement, ruangan, keaktifan];
    // menentukan bobot
    const bobot = ArrayWeight;

    let PositiveRange = 0;
    let NegativeRange = 0;

    // menentukan solusi ideal positif dan negatif
    const IdealPositive = bobot;
    const IdealNegative = 0;

    for (let i = 0; ValueList.length > i; i++) {
      // perhitungan skor alternatif
      let nilai = ValueList[i] / 100;
      nilai = nilai * bobot[i];

      // menentukan jarak ideal positif dan negatif tiap value
      let PositiveValue = (IdealPositive[i] - nilai) ** 2;
      let NegativeValue = (IdealNegative - nilai) ** 2;

      PositiveRange = PositiveRange + PositiveValue;
      NegativeRange = NegativeRange + NegativeValue;
    }

    // menghitung nilai preferensi
    let FinalValue = (NegativeRange / (NegativeRange + PositiveRange)) * 100;

    return FinalValue;
  };

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="lg:flex relative">
        <div className="w-full lg:mx-3">
          <div className="my-6">
            <label
              for="default"
              className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
            >
              Nama
            </label>
            <select
              id="id"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              value={formik.values.id}
              onChange={formik.handleChange}
            >
              <option value="">Pilih Penerima Nilai</option>
              {dataNama?.map((item) => (
                <option value={item.id + "!" + item.name + "!" + item.voice_type}>{item.name}</option>
              ))}
            </select>
            {formik.errors.id && formik.touched.id && (
              <div className="text-red-500 text-sm ms-2 mt-2">
                {formik.errors.id}
              </div>
            )}
          </div>
          <div className="grid lg:grid-cols-4 md:grid-cols-2 grid-cols-1 justify-around w-full gap-6">
            <div>
              <label
                for="default"
                className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
              >
                Support
              </label>
              <input
                type="number"
                id="support"
                className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
                placeholder="Nilai Support"
                value={formik.values.support}
                onChange={formik.handleChange}
              />
              {formik.errors.support && formik.touched.support && (
                <div className="text-red-500 text-sm ms-2 mt-2">
                  {formik.errors.support}
                </div>
              )}
            </div>

            <div>
              <label
                for="default"
                className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
              >
                Placement
              </label>
              <input
                type="number"
                id="placement"
                className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
                placeholder="Nilai Placement"
                value={formik.values.placement}
                onChange={formik.handleChange}
              />
              {formik.errors.placement && formik.touched.placement && (
                <div className="text-red-500 text-sm ms-2 mt-2">
                  {formik.errors.placement}
                </div>
              )}
            </div>

            <div>
              <label
                for="default"
                className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
              >
                Ruangan
              </label>
              <input
                type="number"
                id="ruangan"
                className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
                placeholder="Nilai Ruangan"
                value={formik.values.ruangan}
                onChange={formik.handleChange}
              />
              {formik.errors.ruangan && formik.touched.ruangan && (
                <div className="text-red-500 text-sm ms-2 mt-2">
                  {formik.errors.ruangan}
                </div>
              )}
            </div>

            <div>
              <label
                for="default"
                className="block mb-2 ms-2 text-sm font-medium text-green-700 dark:text-green-500"
              >
                Keaktifan
              </label>
              <input
                type="number"
                id="keaktifan"
                className="bg-green-50 border border-green-500 text-green-900 dark:text-green-400 placeholder-green-700 dark:placeholder-green-500 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5 dark:bg-gray-700 dark:border-green-500"
                placeholder="Nilai Keaktifan"
                value={formik.values.keaktifan}
                onChange={formik.handleChange}
              />
              {formik.errors.keaktifan && formik.touched.keaktifan && (
                <div className="text-red-500 text-sm ms-2 mt-2">
                  {formik.errors.keaktifan}
                </div>
              )}
            </div>
          </div>
          <div className="flex w-full mt-6 justify-end ">
            {/*Submit button*/}
            <div className="text-center">
              {Addloading ? (
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
        </div>
      </div>
    </form>
  );
}
