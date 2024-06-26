import BreadCrumb from "../../../components/Breadcrumb";
import { GraphQlUsers } from "../../../graphql/GraphQlUsers";
import Loading from "../../../components/Loading";
import Footers from "../../../components/Footer";
import CardList from "../../../components/CardList";
import { GetAllPeopleByPosition } from "../../../components/GetAllPeople";

export default function ListAnggota() {
  const {
    ketua,
    wakil,
    bendahara1,
    bendahara2,
    sekretaris1,
    sekretaris2,
    koorhumas,
    humasinternal,
    humaseksternal,
    koorpelatihan,
    kepelatihan,
    koordanus,
    danus,
    koorinventaris,
    perkab,
    estetika,
    koorpublikasi,
    publikasi,
    kreatif,
    loading,
    error,
  } = GetAllPeopleByPosition();

  return (
    <div className="bg-blue-800">
      <div className="absolute h-[400px] w-full text-white bg-headerOrganization bg-no-repeat bg-cover bg-center bg-scroll">
        <div className="bg-blue-600/40 h-full">
          <div className="flex justify-center p-2 font-bold">
          <h1 className="md:text-4xl lg:text-4xl text-2xl uppercase font-black mt-44">
              {" "}
              ORGANIZATION{" "}
            </h1>
          </div>
          <div className="flex justify-center font-bold">
            <BreadCrumb items={["organization"]} />
          </div>
        </div>
      </div>
      <div className="bg-blue-700 relative top-[400px] lg:pt-9 md:pt-5">
        <div className="p-3">
          <div className=" bg-white rounded lg:mx-9 lg:mb-9 md:mx-5 md:mb-5 lg:p-6 md:p-4">
            {loading ? (
              <Loading />
            ) : (
              <div >
                <CardList
                  Title="Badan Pengurus Harian"
                  koor={[...ketua, ...wakil]}
                  member={[
                    ...sekretaris1,
                    ...sekretaris2,
                    ...bendahara1,
                    ...bendahara2,
                  ]}
                />
                <div className="w-full border-t border-blue-600 my-8"></div>
                <CardList
                  Title="Devisi Hubungan Masyarakat"
                  koor={koorhumas}
                  member={[...humasinternal, ...humaseksternal]}
                />
                <div className="w-full border-t border-blue-600 my-8"></div>
                <CardList
                  Title="Devisi Kepelatihan"
                  koor={koorpelatihan}
                  member={kepelatihan}
                />
                <div className="w-full border-t border-blue-600 my-8"></div>
                <CardList
                  Title="Devisi Dana Usaha"
                  koor={koordanus}
                  member={danus}
                />
                <div className="w-full border-t border-blue-600 my-8"></div>
                <CardList
                  Title="Devisi Inventaris"
                  koor={koorinventaris}
                  member={[...perkab, ...estetika]}
                />
                <div className="w-full border-t border-blue-600 my-8"></div>
                <CardList
                  Title="Devisi Publikasi"
                  koor={koorpublikasi}
                  member={[...kreatif, ...publikasi]}
                />
              </div>
            )}
          </div>
        </div>
        <Footers />
      </div>
    </div>
  );
}
