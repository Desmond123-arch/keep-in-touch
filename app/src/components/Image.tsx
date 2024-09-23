const Image = ({ fileName, base64Data }) => {
    return (
        <div>
            <img
                style={{ width: 150, height: "auto" }}
                src={`data:image/jpeg;base64,${base64Data}`} // assuming the image is JPEG, adjust if needed
                alt={fileName}
            />
        </div>
    );
};

export default Image;
