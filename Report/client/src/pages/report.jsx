import { useEffect, useState } from "react"
// แทนที่จะใช้ @/components/ui
// ให้ import จาก path ที่ถูกต้องตาม project structure ของคุณ
import { Input } from "../components/ui/input"
import { Card } from "../components/ui/card"
import axios from "axios";

export default function CreateReport() {
  const [Items, setItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([])
  const [error, setError] = useState([])

  const [info, setinfo] = useState({
    reportName: "",
    timestamp_start: "",
    timestamp_end: ""
  })

  useEffect(() => {
    axios.get("http://localhost:5001/inventory/getAllProducts").then((res) => {
      setItems(res.data);
    });
  }, []);

  const handleSelect = (value) => {
    const data = JSON.parse(value)

    if (!selectedItems.some(item => item.productIDs === data.productIDs)) {
      setSelectedItems([...selectedItems, data])
    }

    console.log(selectedItems)
    console.log(info.timestamp_start, info.timestamp_end)
  }

  const removeItem = (item) => {
    setSelectedItems(selectedItems.filter((i) => i.productIDs !== item))
    console.log(item)
  }

  const submit = async (e) => {
    e.preventDefault();
    console.log("submit!!!");

    try {
      const products = selectedItems.map(item => item.productIDs);
      console.log("pro_id",products)
      // ส่ง request ไปที่เซิร์ฟเวอร์เพื่อสร้าง report
      const response = await axios.post("http://localhost:5001/report/Createreport", {
        products: products,
        timestamp_start: info.timestamp_start,
        timestamp_end: info.timestamp_end
      });

      console.log("Report generated successfully");

      if (response.data.downloadUrl) {
        window.open(`http://localhost:5001${response.data.downloadUrl}`, "_blank");
        console.log("API Response:", response.data);
        setError("")
      }

    } catch (error) {
      console.log("form ERROR", error);
      setError("data NOT FOUND")
    }
  };


  return (
    <div className="flex h-screen  pt-8 justify-center bg-[#F7F7F7] p-4">
      <Card className="w-full max-w-2xl bg-white">
        <p className="text-2xl text-center pt-8">Create Report</p>
        <form action="" className="pt-8" onSubmit={(e) => { submit(e) }}>


          <div className="flex items-center gap-0">
            {/* Start Date */}
            <div className="flex flex-col">
              <label htmlFor="StartDate" className="text-xl pl-8">Start Date</label>
              <Input
                id="StartDate"
                type="datetime-local"
                value={info.timestamp_start}
                onChange={(e) => setinfo((prev) => ({ ...prev, timestamp_start: e.target.value }))}
                className="mt-1 w-64 rounded-md border border-gray-300 bg-[#F7F7F7] px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* End Date */}
            <div className="flex flex-col">
              <label htmlFor="EndDate" className="text-xl pl-8">End Date</label>
              <Input
                id="EndDate"
                type="datetime-local"
                value={info.timestamp_end}
                onChange={(e) => setinfo((prev) => ({ ...prev, timestamp_end: e.target.value }))}
                className="mt-1 w-64 rounded-md border border-gray-300 bg-[#F7F7F7] px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>


          <div className="mt-8" >
            <label htmlFor="" className="pl-8 text-xl">Select Inventory</label>
            <select className="mx-8 flex h-10 w-full max-w-xl bg-[#F7F7F7] rounded-md border border-gray-300  px-4 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              onChange={(e) => { handleSelect(e.target.value) }} defaultValue="">
              <option value="" disabled>Select Item</option>
              {
                Items?.map((item, index) => {
                  return <option value={JSON.stringify({ productIDs: item._id, productName: item.name })} key={index}>{item.name}</option>
                })
              }
            </select>
          </div>

          <div className="p-4">
                        {selectedItems.length > 0 && (
              <h2 className="text-lg font-semibold mb-2">Selected Items</h2>
            )}
            <div className="flex flex-wrap gap-2">
              {selectedItems.map((item, index) => (
                <div key={index} className="ml-4 border border-[#474747] px-4 py-2 rounded-md" value={item.productIDs} onClick={(e) => { removeItem(item.productIDs) }}>
                  {item.productName}
                </div>
              ))}
            </div>
          </div>
          {error && <p className="pl-8 pt-8 text-red-500">{error}</p>}
          <div className="pt-16 flex justify-center">
            <button type="submit"
              class="focus:outline-none text-white bg-purple-700 hover:bg-purple-800 focus:ring-4 focus:ring-purple-300 font-medium rounded-lg text-sm px-5 py-2.5 mb-2 dark:bg-purple-600
             dark:hover:bg-purple-700 dark:focus:ring-purple-900">
              Submit
            </button>
          </div>
        </form>



      </Card>
    </div>
  )
}