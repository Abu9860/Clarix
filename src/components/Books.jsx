import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTION_ID_books } from "../lib/appwrite";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      const res = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_books
      );
      setBooks(res.documents);
    };

    fetchBooks();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {books.map((book) => (
        <div key={book.$id}>
          <h2>{book.title}</h2>
          <div style={{ border: "1px solid #ccc", height: "360px", overflow: "hidden" }}>
  <embed
    key={page} // force reload
    src={`${book.coverImageUrl}#page=${page}&view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
    type="application/pdf"
    height="100%"
    width="100%"
    style={{ border: "none" }}
  />
</div>
         

          <div style={{ marginTop: 10 }}>
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
              Prev
            </button>

            <button onClick={() => setPage((p) => p + 1)}>
              Next
            </button>

            <span style={{ marginLeft: 10 }}>Page {page}</span>
          </div>
        </div>
      ))}
    </div>
  );
}