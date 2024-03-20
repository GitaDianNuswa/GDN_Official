import { useEffect, useState } from "react";
import Search from "../../../components/Search";
import { GraphQlNews, GraphQlDeleteNewsById } from "../../../graphql/GrpahQlNews";
import Pagination from "../../../components/Pagination";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/solid";
import Loading from "../../../components/Loading";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import Alert from "../../../components/Alert";
import ModalConfirm from "../../../components/ModalConfirm";

export default function News(){
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  const { NewsData, loadingNews, errorNews } = GraphQlNews();
  const { DeleteNews, LoadingDelete, ErrorDelete } = GraphQlDeleteNewsById()

  const [search, setSearch] = useState("");

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  const [deleteModalId, setDeleteModalId] = useState(null);
  const [deleteModalTitle, setDeleteModalTitle] = useState(null);

  const openDeleteModal = (id, title) => {
    setDeleteModalId(id);
    setDeleteModalTitle(title);
  };

  const closeDeleteModal = () => {
    setDeleteModalId(null);
    setDeleteModalTitle(null);
  };

  const handleDelete = async (idx) => {
    await DeleteNews({
      variables: {
        id: idx,
      },
    });
    openAlert("success", "Item Berhasil Dihapus");
    closeDeleteModal();
  };


  return (
    <div>
      {isAlert && (
        <Alert variant={variant} message={message} onClose={closeAlert} />
      )}
      <h2 class="text-4xl font-bold dark:text-white mb-6 ms-6">List News</h2>
      {loadingNews && LoadingDelete ? (
        <Loading />
      ) : (
        <div>
          <div className="flex w-full justify-between items-center">
            <Search
              id="search-input"
              placeholder="Cari nama anggota"
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              value={search}
            />
            <Link
              to="./addnews"
              className="mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-3xl text-sm p-2 w-80 text-center flex items-center justify-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Tambahkan Berita
              <PlusIcon className="h-6 w-6 ml-1" />
            </Link>
          </div>

          <div className="overflow-x-auto my-6">
            <table className="table-auto w-full border-collapse overflow-hidden border border-blue-800">
              <thead className="text-center bg-blue-800 text-white">
                <tr>
                  <th className="px-4 py-2">No</th>
                  <th className="px-4 py-2">Judul</th>
                  <th className="px-4 py-2">Waktu Rilis</th>
                  <th className="px-4 py-2">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {NewsData?.news
                  .filter(
                    (news) =>
                      news.title.toLowerCase().includes(search.toLowerCase())
                  )
                  .slice(indexOfFirstItem, indexOfLastItem)
                  .map((news, index) => (
                    <tr
                      key={index}
                      className={
                        index % 2 === 0 ? "bg-gray-200" : "bg-gray-100"
                      }
                    >
                      <td className="border px-4 py-2 min-w-fit text-center">
                        {index + indexOfFirstItem + 1}
                      </td>
                      <td className="border px-4 py-2 min-w-[300px]">
                        {news.title}
                      </td>
                      <td className="border px-4 py-2 min-w-[180px]">
                        {dayjs(news.created_at).format('MMM D, YYYY H:mm A')}
                      </td>
                      <td className="border px-4 py-2 min-w-[150px]">
                        <div className="flex w-full justify-around">
                          <Link
                            type="button"
                            class="text-green-700 border-1 border-green-700 hover:bg-green-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-green-500 dark:text-green-500 dark:hover:text-white dark:focus:ring-green-800 dark:hover:bg-green-500"
                            to={"./editnews/"+news.id}
                          >
                            <PencilIcon className="w-4 h-4" />
                            <span class="sr-only">Edit</span>
                          </Link>
                          <button
                            type="button"
                            class="text-red-700 border-1 border-red-700 hover:bg-red-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-full text-sm p-2.5 text-center inline-flex items-center dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:focus:ring-red-800 dark:hover:bg-red-500"
                            onClick={() =>
                              openDeleteModal(news.id, news.title)
                            }
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span class="sr-only">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6">
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing{" "}
                  <span className="font-medium">{indexOfFirstItem}</span> to{" "}
                  <span className="font-medium">
                    {Math.ceil(
                      NewsData?.news.filter(
                        (news) =>
                          news.title
                            .toLowerCase()
                            .includes(search.toLowerCase())
                      ).length / itemsPerPage
                    ) == currentPage
                      ? NewsData?.news.filter(
                          (news) =>
                            news.title
                              .toLowerCase()
                              .includes(search.toLowerCase())
                        ).length
                      : indexOfLastItem}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">
                    {NewsData?.news.filter(
                      (news) =>
                        news.title
                          .toLowerCase()
                          .includes(search.toLowerCase())
                    ).length + " "}
                  </span>
                  results
                </p>
              </div>
              <Pagination
                itemsPerPage={itemsPerPage}
                totalItems={
                  NewsData?.news.filter(
                    (news) =>
                      news.title.toLowerCase().includes(search.toLowerCase())
                  ).length
                }
                paginate={paginate}
                currentPage={currentPage}
              />
            </div>
          </div>
        </div>
      )}
      {deleteModalId && (
        <ModalConfirm
          title="Hapus produk yang dipilih?"
          description={`Berita dengan judul ${deleteModalTitle} yang dipilih akan dihapus secara permanen`}
          labelCancel="Batal"
          labelConfirm="Hapus"
          variant="danger"
          onCancel={closeDeleteModal}
          onConfirm={() => handleDelete(deleteModalId)}
        />
      )}
    </div>
  );
}