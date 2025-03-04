import React from 'react';

const Table = ({title, items, header }) => {
    return (
<div className="rounded-lg border border-gray-300 shadow-sm">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <div className="p-6">
              <div className="relative w-full overflow-auto">
                <table className="w-full caption-bottom text-sm">
                  <thead className="[&_tr]:border-b ">
                    <tr className="border-b">
                      <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">ชื่อสินค้า</th>
                      <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">{header}</th>
                    </tr>
                  </thead>
                  <tbody className="[&_tr:last-child]:border-0">
                    {items?.map((item, index) => (
                      <tr key={index} className="border-b transition-colors hover:bg-muted/50">
                        <td className="p-4 align-middle font-medium">{item?._id}</td>
                        <td className="p-4 align-middle text-right">{item?.totalOut || item?.totalQuantity} ชิ้น</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
    );
};

export default Table;