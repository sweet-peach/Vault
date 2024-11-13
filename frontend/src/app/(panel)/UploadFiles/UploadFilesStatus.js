import styles from "./FilesUpload.module.scss";
import useUploadStore from "@/app/(panel)/drive/UploadFiles/uploadFilesStore";

export default function UploadFilesStatus(){
    const uploadFiles = useUploadStore((state) => state.uploadFiles);
    if(uploadFiles.length === 0) return;

    return (
        <div className={styles.fileUploadContainer}>
            <div className={styles.fileUploadWrapper}>
                Files upload status
            </div>
        </div>
    )
}