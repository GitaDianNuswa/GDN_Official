import { useState } from "react";
import Search from "../../../components/Search";
import Pagination from "../../../components/Pagination";
import { PencilIcon, PlusIcon } from "@heroicons/react/24/solid";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import { GraphQlCompetition } from "../../../graphql/GraphQlCompetition";
import ItemNotFound from "../../../components/ItemNotFound";
import dayjs from "dayjs";

export default function Competition() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const {CompetitionData,CompetitionLoading,CompetitionError} = GraphQlCompetition();

  const [search, setSearch] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  console.log(CompetitionData)

  return (
    <div>
      <h2 class="lg:text-4xl md:text-3xl text-2xl font-bold dark:text-white text-center mb-6">
        List Kompetisi
      </h2>
      <div className="lg:flex flex-1 w-full justify-center items-center mb-3">
        <Search
          id="search-input"
          placeholder="Cari kompetisi"
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          value={search}
        />
        <Link
          to={"./addcompetition"}
          className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl lg:text-sm md:text-sm text-xs p-2 px-4 lg:w-80 md:w-4/12 w-fit text-center flex items-center container justify-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Tambah Kompetisi
          <PlusIcon className="lg:h-6 h-4 lg:w-6 w-4 ml-1" />
        </Link>
      </div>
      {CompetitionLoading ? (
        <Loading />
      ) : CompetitionData?.competition.filter((element) =>
          element.name.toLowerCase().includes(search.toLowerCase())
        ).length > 0 ? (
        <div>
          <div className="overflow-x-auto my-6">
            <table className="table-auto w-full border-collapse overflow-hidden border border-blue-800">
              <thead className="text-center bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Nama Kompetisi</th>
                  <th className="px-4 py-2">Tanggal Kompetisi</th>
                  <th className="px-4 py-2">Tanggal Input</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {CompetitionData?.competition.filter((element) =>
                    element.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((element, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                      }
                    >
                      <td className="border px-4 py-2 min-w-fit text-center">
                        {index + indexOfFirstItem + 1}
                      </td>
                      <td className="border px-4 py-2 min-w-[100px]">
                        {element.name}
                      </td>
                      <td className="border px-4 py-2 min-w-[180px] text-center">
                        {dayjs(element.date).format("MMM D, YYYY")}
                      </td>
                      <td className="border px-4 py-2 min-w-[180px] text-center">
                        {dayjs(element.created_at).format("MMM D, YYYY")}
                      </td>
                      <td className="border px-4 py-2 min-w-[50px]">
                        <div className="flex w-full justify-around">
                          <Link
                            type="button"
                            class="text-green-700 border-1 border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
                            to={"./editcompetition/" + element.id}
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span class="sr-only">Edit</span>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-center border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="flex lg:flex-1 md:flex-1 sm:items-center justify-between">
              <div>
                <p className="text-sm text-gray-700 hidden md:block lg:block">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem}</span> to{" "}
                  <span className="font-medium">
                    {Math.ceil(
                      CompetitionData?.competition.filter((element) =>
                        element.name
                          .toLowerCase()
                          .includes(search.toLowerCase())
                      ).length / itemsPerPage
                    ) == currentPage
                      ? CompetitionData?.competition.filter((element) =>
                          element.name
                            .toLowerCase()
                            .includes(search.toLowerCase())
                        ).length
                      : indexOfLastItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {CompetitionData?.competition.filter((element) =>
                      element.name.toLowerCase().includes(search.toLowerCase())
                    ).length + " "}
                  </span>
                  results
                </p>
              </div>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={
                    CompetitionData?.competition.filter((element) =>
                    element.name.toLowerCase().includes(search.toLowerCase())
                  ).length
                }
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      ) : (
        <ItemNotFound />
      )}
    </div>
  );
}
