import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTION_ID } from "../lib/appwrite";

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchBooks = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID
        );

        if (isMounted) {
          setBooks(res.documents);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching books:", error);
      }
    };

    fetchBooks();

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) return <p>Loading books...</p>;

  return (
    <div>
      {books.map((book) => (
        <div key={book.$id}>
          <h3>{book.title}</h3>
        </div>
      ))}
    </div>
  );
}