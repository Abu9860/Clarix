import { useEffect, useState } from "react";
import { databases, DATABASE_ID, COLLECTION_ID_books } from "./lib/appwrite";

function App() {
  const [, setDocs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_books
        );
        setDocs(res.documents);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      <video />
    </div>
  );
}

export default App;