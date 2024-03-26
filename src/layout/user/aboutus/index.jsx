import BreadCrumb from "../../../components/Breadcrumb";
import { GraphQlUsers } from "../../../graphql/GraphQlUsers";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { GetAllPeopleByPosition } from "../../../components/GetAllPeople";
import Footers from "../../../components/Footer";
import AOS from "aos";
import { useEffect } from "react";
import Logo from "../../../assets/logo_PSM.png";

export default function AboutUs() {
  useEffect(() => {
    AOS.init({ duration: 500 });
  });

  const { ketua, loading, error } = GetAllPeopleByPosition();
  const achievement = [
    "Peraih Juara III Lomba Paduan Suara Konsumen Cerdas Disperindag Jawa Tengah",
    "Peraih Gold Medal di 1st Taipei International Choral Competition kategori “Folklore” tahun 2018",
    "Peraih Gold Medal di 1st Taipei International Choral Competition kategori “Youth” tahun 2018",
    "Peraih Best Performance untuk lagu Taiwan di 1st Taipei International Choral Competition tahun 2018",
    "Peraih Silver B Medal di 8th Satya Dharma Gita Choir kategori “Mixed” tahun 2021",
    "Peraih Silver A Medal di 10 International Brawijaya Choir Festival kategori “Folklore” tahun 2022",
    "Peraih Silver Medal di Pesta Paduan Suara Gerejawi Mahasiswa tahun 2022",
    "Peraih Silver Medal di 7th Singapore International Choral Festival kategori “Folklore” tahun 2023",
    "Peraih Silver Medal di 7th Singapore International Choral Festival kategori “Mixed” tahun 2023",
    "Peraih Gold Medal di 4th Karangturi International Choir Competition kategori “Mixed Voice” tahun 2023",
  ];

  return (
    <div className="bg-blue-800">
      <div className="absolute h-[400px] w-full text-white bg-headerAboutUs bg-no-repeat bg-cover bg-scroll">
        <div className="bg-blue-600/40 h-full">
          <div className="flex justify-center p-2 font-bold">
            <h1 className="text-4xl uppercase font-black mt-44"> About US </h1>
          </div>
          <div className="flex justify-center font-bold">
            <BreadCrumb items={["about us"]} />
          </div>
        </div>
      </div>
      <div className="bg-blue-700 relative top-[400px] pt-16">
        <div className=" bg-white rounded mx-16 p-8 mb-16">
          <div>
            <div className="flex my-6 justify-around">
              <div className="w-8/12">
                <h1
                  className="font-black text-3xl text-center uppercase mb-3"
                  data-aos="fade-right"
                >
                  gita dian nuswa
                </h1>
                <h1
                  className="font-extrabold text-xl capitalize"
                  data-aos="fade-right"
                >
                  apa itu gita dian nuswa?
                </h1>
                <div className="mb-8" data-aos="fade-right">
                  <p className="my-3 text-justify">
                    Paduan Suara Mahasiswa Universitas Dian Nuswantoro (UDINUS)
                    yang dikenal sebagai PSM Gita Dian Nuswa merupakan Unit
                    Kegiatan Mahasiswa yang berkembang di bidang seni khususnya
                    seni suara. Berdiri sejak tahun 1995, PSM Gita Dian Nuswa
                    sudah beberapa kali mengikuti ajang kompetisi tingkat
                    nasional maupun internasional dan berhasil meraih prestasi
                    yang membanggakan.
                  </p>
                  <p className="my-3 text-justify">
                    Selain prestasi di dunia seni suara, PSM Gita Dian Nuswa
                    juga berperan penting dalam menyemarakkan kehidupan kampus.
                    Turut serta dalam acara-acara kampus, meramaikan perayaan,
                    dan memberikan warna positif dalam lingkungan akademis.
                  </p>
                  <p className="my-3 text-justify">
                  Melalui dedikasi dan prestasinya, PSM Gita Dian Nuswa tidak hanya menjadi wadah bagi pengembangan bakat seni suara mahasiswa UDINUS tetapi juga menjadi kebanggaan bagi universitas dalam menghadapi kompetisi seni suara di tingkat yang lebih luas.
                  </p>
                </div>
              </div>
              <img
                className="w-3/12 h-full filter drop-shadow-2xl place-self-center"
                src={Logo}
                alt="new"
                data-aos="fade-right"
              />
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div>
              <h1
                className="font-black text-3xl text-center capitalize mb-3"
                data-aos="fade-left"
              >
                Profil Ketua
              </h1>
              <h1
                className="font-extrabold text-xl text-center capitalize"
                data-aos="fade-left"
              >
                {ketua[0].name}
              </h1>
              <div className="flex my-6 justify-around">
                <img
                  className="w-3/12 h-full rounded-full place-self-center"
                  src={ketua[0].image}
                  alt="new"
                  data-aos="fade-left"
                />
                <div className="w-8/12">
                  <div className="mb-8" data-aos="fade-left">
                    <h4 className="text-lg font-semibold mb-2">Visi:</h4>
                    <p>
                      Menjadikan Paduan Suara Gita Dian Nuswa sebagai wadah
                      inspirasi dan mengelola potensi di bidang paduan suara,
                      menginspirasi keluarga Gita Dinus untuk terus berkarya
                      dengan semangat untuk menjadi penggerak kegiatan seni di
                      lingkungan kampus dan eksternal.
                    </p>
                  </div>
                  <div data-aos="fade-left">
                    <h4 className="text-lg font-semibold mb-2">Misi:</h4>
                    <ul className="list-disc pl-6 ">
                      <li>
                        Menciptakan lingkungan berdasarkan rasa kekeluargaan
                        dalam PSM GDN.
                      </li>
                      <li>
                        Meningkatkan keterlibatan anggota dalam kegiatan PSM
                        GDN.
                      </li>
                      <li>
                        Membangun budaya latihan yang lebih disiplin dan efektif
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div
                class="inline-flex items-center justify-center w-full"
                data-aos="zoom-in-up"
              >
                <hr class="w-64 h-1 my-8 bg-gray-900 border-0 rounded dark:bg-gray-700" />
                <div class="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
                  <svg
                    class="w-4 h-4 text-gray-700 dark:text-gray-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 14"
                  >
                    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                  </svg>
                </div>
              </div>

              <h1
                className="font-extrabold text-xl capitalize"
                data-aos="zoom-in-up"
              >
                Sejarah Gita Dian Nuswa
              </h1>
              <p className="my-3 text-justify" data-aos="zoom-in-up">
                Paduan Suara Mahasiswa Universitas Dian Nuswantoro berdiri pada
                tanggal 1 Desember 1995. Pembina pertama UKM Paduan Suara
                Mahasiswa Udinus adalah DR Yohan Wismantoro SE, MM, yang
                sekaligus menjadi pencipta lagu Hymne dan Mars Universitas Dian
                Nuswantoro. Selanjutnya dibawah naungan Yuventius Tyas Catur
                Pramudi, S.Si, M.Kom, selaku Pembina kedua, dicetuskanlah "GITA
                DIAN NUSWA" sebagai nama resmi UKM Paduan Suara Mahasiswa
                Udinus. Pembina untuk periode 2013 - 2022 adalah Bambang Minarso
                S.E., M.Si., Ak. Pembina untuk periode 2022-sekarang adalah
                Lenni Yovita S.E., M.Si
              </p>

              <div
                class="inline-flex items-center justify-center w-full"
                data-aos="zoom-in-up"
              >
                <hr class="w-64 h-1 my-8 bg-gray-900 border-0 rounded dark:bg-gray-700" />
                <div class="absolute px-4 -translate-x-1/2 bg-white left-1/2 dark:bg-gray-900">
                  <svg
                    class="w-4 h-4 text-gray-700 dark:text-gray-300"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 18 14"
                  >
                    <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
                  </svg>
                </div>
              </div>

              <h1
                className="font-extrabold text-xl capitalize mt-3"
                data-aos="zoom-in-up"
              >
                Prestasi Gita Dian Nuswa
              </h1>
              <ol class="list-decimal my-3 list-inside">
                {achievement.map((prestasi) => (
                  <li className="mb-1" data-aos="zoom-in-up">
                    {prestasi}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
        <Footers />
      </div>
    </div>
  );
}
