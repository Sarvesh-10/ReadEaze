import { Viewer, Worker, SpecialZoomLevel } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import ChatSection from "../Components/ChatSection/ChatSection";
import { MessageContext } from "../Contexts/MessageContext";
import ImageModal from "../Components/ImageModal/ImageModal";
import { AppDispatch, RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { closeImageModal } from "../store/slices/image-modal-slice";
import { closeMenu, openMenu } from "../store/slices/menuslice";
import ContextMenu from "../Components/ContextMenu/ContextMenu";
import { getBookById } from "../store/actions";

const workerUrl = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

const BookViewer = () => {
  const { id } = useParams<{ id: string }>();
  //Id here is book Id
  // const [menuVisible, setMenuVisible] = useState(false);

  // ✅ Call `defaultLayoutPlugin()` inside the component function
  const defaultLayout = defaultLayoutPlugin();
  const { sendMessage } = useContext(MessageContext) || {};
  const [pdfBlobUrl, setPdfBlobUrl] = useState<string | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const selectionDisabledRef = useRef(false);


  const dispatch = useDispatch<AppDispatch>();
  const [isOpen, modalImageUrl, generating]:[boolean, string, boolean] = useSelector(
    (state: RootState) => [
      state.image.isOpen as boolean,
      state.image.imageUrl as string,
      state.image.isGenerating as boolean,
    ]
  );

  useEffect(() => {
    if (id !== undefined) {
      const bookIdNum = Number(id);
      if (!isNaN(bookIdNum)) {
        dispatch(getBookById(bookIdNum)).unwrap().then((result) => {
          if (getBookById.rejected.match(result)) {
            console.error("Failed to fetch book by ID:", result.payload);
          } else {
            // The result is the PDF URL
            const pdfUrl = result as string;
            setPdfBlobUrl(pdfUrl);
          } 
        });
      }
    }
  }, [id]);

  const clearSelection = () => { 
    setSelectedText(null);
    dispatch(closeMenu());
  }


  useEffect(() => {

    const handleMouseDown = (event: MouseEvent) => {
      if(menuRef.current && menuRef.current.contains(event.target as Node)) {
        // Clicked inside the menu, do nothing
        selectionDisabledRef.current = true;
        
      }else{
        // Clicked outside the menu, enable text selection
        selectionDisabledRef.current = false;
      }
    }

    const handleTextSelection = () => {
      if (selectionDisabledRef.current) {
        return;
      }
      const selection = window.getSelection();
      console.log(selection);
      if (selection && selection.toString().trim()) {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

       
        setSelectedText(selection.toString());

       dispatch(openMenu({
          x: rect.left,
          y: rect.top,
        }));
      } else {
        // No text selected, close the menu
        clearSelection();
 
      }
    };

    document.addEventListener("mouseup", handleTextSelection);
    document.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleTextSelection);
      document.removeEventListener("mousedown", handleMouseDown);
    };
  }, []);

  return (
    <div>
      <div
        style={{
          display: "flex",
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: "60%",
            height: "100%",
            position: "relative",
            overflow: "auto",
          }}
        >
          {pdfBlobUrl ? (
            <Worker workerUrl={workerUrl}>
              <Viewer
                fileUrl={pdfBlobUrl}
                defaultScale={SpecialZoomLevel.PageWidth}
                plugins={[defaultLayout]}
              />
            </Worker>
          ) : (
            <p>Loading PDF...</p>
          )}

          <ContextMenu selectedText={selectedText} sendMessage={sendMessage} bookId={id} menuRef={menuRef}/>
        </div>

        <ChatSection id={id ?? ""} />
      </div>
      <ImageModal
        isOpen={isOpen}
        onClose={() => {
          dispatch(closeImageModal());
        }}
        imageUrl={modalImageUrl}
        caption="Generated image"
        isLoading={generating}
        onDownload={() => alert("Download clicked")}
      />
    </div>
  );
};

export default BookViewer;
