import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-toastify'
import {MdOutlineDelete} from 'react-icons/md'
import Loader from './Loader'

function FileUpload() {
    const [selectedFiles, setSelectedFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const onDrop = useCallback(acceptedFiles => { // useCallback is used to optimize re-rendering of the function onDrop as on every re-render of component the functions also re-renders but using useCallback prevents that and uses the same instance of the function
        setSelectedFiles(prevFiles => [
            ...prevFiles,
            ...acceptedFiles.map(file => ({
                file, // same as file: file
                preview: URL.createObjectURL(file)
            }))
        ])
        console.log(acceptedFiles) // handy for viewing file properties
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
        onDrop,
        accept: {
            'image/jpeg': ['.png', '.jpg'],
            'application/pdf': [],
        }
    }) // onDrop is a callback function

    const removeFiles = (name) => {
        setSelectedFiles(prevFiles => prevFiles.filter(resume => resume.file.path !== name))
    }

    const handleUpload = async() => {
        const formData = new FormData()
        formData.append('resume', selectedFiles[selectedFiles.length - 1].file)
        console.log("file => ",formData);

        try {
            setLoading(true)
            const response = await fetch('http://localhost:5000/file/upload', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (data.success) {
                toast.success("File uploaded successfully")
            } else {
                toast.error(data.msg);
            }

            setSelectedFiles([])
        } catch (error) {
            toast.error('Internal server error', error);
        }
        setLoading(false)
    }

    const handleUpload2 = async() => {
        const formData = new FormData()

        for (let i = 0; i < selectedFiles.length; i++) {
            formData.append("resumes", selectedFiles[i].file);
        }

        try {
            setLoading(true)
            const response = await fetch('http://localhost:5000/file/uploadMultiple', {
                method: 'POST',
                body: formData
            })

            const data = await response.json();
            if(data.success) {
                toast.success('Files uploaded successfully')
            } else {
                toast.error(data.msg)
            }

            setSelectedFiles([])
        } catch(err) {
            console.error(err)
            toast.error('internal server error')
        }
        setLoading(false)
    }

    return (
        <div className="mx-auto p-7 flex flex-col items-center">
            {loading && <Loader />}
            <div {...getRootProps({className: "w-full h-[250px] text-white cursor-pointer rounded-lg outline-dashed outline-3 outline-gray-700/70 hover:outline-green-600 transition-all duration-200 ease-in-out flex flex-col gap-4 justify-center items-center"})}>
                <input {...getInputProps({})} />
                {
                    isDragActive ?
                        <p className="text-sm tracking-wide">Drop the files here ...</p> :
                        <div className="text-center text-sm tracking-wide">
                            <p>Drag 'n' drop your resume here, or click to select files</p>
                            <p>( Max file upload size limit is 10MB )</p>
                        </div>
                }
            </div>
            
            <div className="mt-10 relative group">
                <button onClick={(selectedFiles.length > 1) ? handleUpload2 : handleUpload} disabled={selectedFiles.length == 0} className={`font-bold flex items-center gap-2 px-7 py-2 text-lg ${(selectedFiles.length === 0)? 'text-gray-400' : 'text-white hover:outline-blue-600 hover:bg-blue-400'} cursor-pointer rounded-full bg-[rgb(19,24,32)] z-20 outline outline-[5px] outline-gray-700 transition-all ease-in-out duration-200`}>
                    Upload
                </button>
                <div className=''></div>
                <div className={`w-[20px] h-[20px] outline outline-[5px] rounded-md outline-gray-700 rotate-[45deg] absolute top-1/2 -left-14 -translate-y-1/2 ${selectedFiles.length > 0 && 'group-hover:outline-blue-500 group-hover:rotate-[-45deg]'} transition-all duration-300 ease-in-out`}></div>
                <div className={`w-[20px] h-[20px] outline outline-[5px] rounded-md outline-gray-700 rotate-[-45deg] absolute top-1/2 -right-14 -translate-y-1/2 ${selectedFiles.length > 0 && 'group-hover:outline-blue-500 group-hover:rotate-[45deg]'} transition-all duration-300 ease-in-out`}></div>
            </div>

            <ul className="w-full text-white m-7 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-7 gap-5">
                {selectedFiles.map((asset, index) => (
                    <li key={index} className="relative group bg-gray-800 rounded-lg flex flex-col overflow-hidden">
                        <div className="h-72 border-b-[3px] border-blue-300 border-dashed">
                            {(asset.file.type.split('/')[0] === 'image')? 
                                <img src={`${asset.preview}`} className="w-full h-full object-cover"></img> : 
                                <iframe className="w-full h-full" src={`${asset.preview}#view=FitH&toolbar=0`} title={asset.file.path}>
                                Your browser does not support iframes.
                                </iframe>
                            }
                        </div>
                        {/* <iframe src={asset.preview}></iframe> */}
                        <h2 className="m-2">{(asset.file.path.length > 20) ? `${asset.file.path.slice(0, 15)}...` : asset.file.path}</h2>

                        <div className="p-[10px] w-16 h-12 flex gap-3 rounded-bl-lg absolute top-0 right-0 opacity-0 group-hover:opacity-100 group-hover:bg-gray-800/80 transition-opacity ease-in-out duration-300">
                            <MdOutlineDelete className="w-full h-full hover:text-red-400" onClick={() => removeFiles(asset.file.path)}/>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default FileUpload