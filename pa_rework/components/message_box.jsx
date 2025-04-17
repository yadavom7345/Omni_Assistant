import SendMessage from './send_message'
import { useState ,useRef} from 'react'

export default function MessageBox() {

    const [message, setMessage] = useState('')
    const [output, setOutput] = useState('')
    const [pdf, setPDF] = useState(null)
    const [image, setImage] = useState(null)
    const [pdfFileId, setPdfFileId] = useState(null)
    const [isLoading, setIsLoading] = useState(false)


    async function handleclick() {

        try{
            setIsLoading(true)
            setOutput('')
            await SendMessage({ 
                message, 
                onReturn: handleOutput, 
                image,
                pdf, 
                pdfFileId,
                setPdfFileId 
            })
        } catch (error) {
            console.error('Error:', error)
        } finally {
            setIsLoading(false)
        }
    }


    function handleOutput(output) {
        setOutput(output)
    }



    const select_pdf = useRef(null)
    const select_image = useRef(null)


    function handlePDF(e) {
        const file = e.target.files[0]
        setPDF(file)
        setPdfFileId(null)
    }

    function handleImage(e) {
        const file = e.target.files[0]
        setImage(file)
    }

    function handleRemovePDF() {
        setPDF(null)
        setPdfFileId(null)
        select_pdf.current.value = null
    }

    function handleRemoveImage() {
        setImage(null)
        select_image.current.value = null
    }



    return (

        <div className='w-full h-full flex flex-col justify-center items-center'>

        <div className='w-[60%] min-w-[400px] max-w-[1000px] flex flex-col'>
            {(pdf && !image) && 
                <div className='w-full h-12 bg-red-400 rounded-t-xl text-xs flex items-center justify-between p-3 text-center text-white'>
                    <img src={"./public/pdf_icon.png"} alt='pdf' className='w-6 h-6'/>
                    <p className='text-white mx-2 flex-1 text-center truncate'>{pdf.name}</p>
                    <img src={"./public/remove_icon.png"} onClick={handleRemovePDF} alt='pdf' className='w-6 h-6 cursor-pointer'/>
                </div>
            }

            {(image && !pdf) && 
                <div style ={{ backgroundColor: 'rgba(13, 65, 154, 0.7)'}} className='w-full h-12 rounded-t-xl text-xs flex items-center justify-between p-3 text-center text-white'>
                    <img src={"./public/image_icon.png"} alt='image' className='w-6 h-6'/>
                    <p className='text-white mx-2 flex-1 text-center truncate'>{image.name}</p>
                    <img src={"./public/remove_icon.png"} onClick={handleRemoveImage} alt='remove' className='w-6 h-6 cursor-pointer'/>
                </div>
            }

            <div style ={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 45px 8px'}} 
                className={`bg-gray-100 w-full min-h-[600px] h-[60%] p-6 flex flex-col ${(pdf || image) ? 'rounded-t-none rounded-b-2xl' : 'rounded-2xl'}`}>

                <input 
                    style ={{ boxShadow: 'rgba(0, 0, 0, 0.2) 0px 0px 45px 3px'}} 
                    onChange={(e) => setMessage(e.target.value)} 
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleclick();
                        }
                    }}
                    type="text" 
                    placeholder='Type your message here...' 
                    className='w-full h-[15%] min-h-[50px] text-center rounded-2xl p-4 bg-gray-500/90 backdrop-blur-lg'
                />

                <div className='w-full flex items-center justify-between py-4 mt-2'>
                    <input ref={select_pdf} type="file" accept='.pdf' className='hidden' onChange={handlePDF}/>
                    <input ref={select_image} type="file" accept='.png, .jpg, .jpeg' className='hidden' onChange={handleImage}/>
                    <div>
                        <button 
                            style ={pdf ? { backgroundColor: 'rgba(88, 110, 149, 0.7)'}:{ backgroundColor: 'rgba(13, 65, 154, 0.7)'}} 
                            onClick={() => select_image.current.click()} 
                            className={`text-white p-2 px-4 rounded-2xl mr-3 text-xs ${pdf ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                            disabled={pdf}
                        >
                            Image
                        </button>
                        <button 
                            style ={image ? { backgroundColor: 'rgba(253, 166, 166, 0.7)'}:{ backgroundColor: 'rgba(255, 0, 0, .7)'}} 
                            onClick={() => select_pdf.current.click()} 
                            className={`text-white p-2 px-4 rounded-2xl text-xs ${image ? 'cursor-not-allowed' : 'cursor-pointer'}`} 
                            disabled={image}
                        >
                            PDF
                        </button>
                    </div>
                    <button 
                        style ={{ backgroundColor: 'rgba(0, 0, 0, 0.7)'}} 
                        onClick={handleclick} 
                        className='text-white p-2 px-6 rounded-2xl text-xs'
                    >
                        Send
                    </button>
                </div>

                <div className='w-full flex-1 rounded-2xl bg-gray-300 mt-2 p-5 overflow-hidden'>
                    <div className='w-full h-full overflow-auto'>
                        {isLoading ? (
                            <div className="flex items-center justify-center h-full">
                                <p className="text-gray-600 animate-pulse">Processing your request...</p>
                            </div>
                        ) : (
                            <p className='p-2 text-black whitespace-pre-wrap'>{output}</p>
                        )}
                    </div>
                </div>

            </div>
        </div>

        </div>

    )
}