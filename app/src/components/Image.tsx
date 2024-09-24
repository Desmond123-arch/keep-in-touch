interface ImageProps {
    fileName?: string; 
    base64Data: string;
  }
const Image: React.FC<ImageProps> = ({ fileName, base64Data }) => {
    console.log('i was called');
    return (
        <div>
            <img
                style={{ width: 150, height: "auto" }}
                src={`data:image/jpg;base64,${base64Data}`} 
                alt={fileName}
            />
        </div>
    );
};

export default Image;
