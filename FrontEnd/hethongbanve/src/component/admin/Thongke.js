import React, {useState, useEffect} from "react"
import { Form, Col, Row } from "react-bootstrap";
import API, { endpoints } from "../../API";
import { Bar } from 'react-chartjs-2';

export default function Thongke(){
    const [month, setMonth] = useState(null);
    const [year, setYear] = useState(null);
    const [data, setData] = useState([]);
    const [mydata, setMydata] = useState(null)

    const loadgraph = async()=>{
        console.log(month, year);
        if (month && year)
            var res = await API.get(`${endpoints['thongke']}get_vexe/?month=${month}&year=${year}`);
        else
            if (month)
                var res = await API.get(`${endpoints['thongke']}get_vexe/?month=${month}`);
            else
            if (year)
                var res = await API.get(`${endpoints['thongke']}get_vexe/?year=${year}`);
            else
                var res = await API.get(`${endpoints['thongke']}get_vexe/`);
        console.log(res.data)
        if (!month && year){
            var table = [0,0,0,0,0,0,0,0,0,0,0,0,0]
            for (const obj of res.data){
                let m = new Date(obj.chuyenxe)
                table[m.getMonth()]++;
            }
            let tmp = {
                labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'],
                datasets: [{
                    label: `Thống kê trong năm ${year}`,
                    data: table,
                    borderWidth: 1,
                    backgroundColor: [
                        'red',
                    ]
                }]
            }
            setMydata(tmp)
        }
        else if (month && year){
            var arr =[];
            var table =[];
            for (var i=1;i<=31;i++){
                arr.push(i.toString());
                table.push(0);
            }

            for (const obj of res.data){
                let m = new Date(obj.chuyenxe)
                table[m.getDate()-1]++;
            }

            let tmp = {
                labels: arr,
                datasets: [{
                    label: `Thống kê trong năm ${year}`,
                    data: table,
                    borderWidth: 1,
                    backgroundColor: [
                        'red',
                    ]
                }]
            }
            setMydata(tmp)
        }
    }

    useEffect(async()=>{
        loadgraph();
    },[])

    const test = async () => {
        await loadgraph();
    }
    let graph = <></>
    if (mydata)
        graph = <Bar data={mydata}/>
            
    return(
        <>
            <Form>
                <Row>
                    <Col md={5}>
                <Form.Group>   
                    <Form.Label>Tháng</Form.Label>      
                    <Form.Control type="number" min="1" max="12" step="1" value ={month} onChange={(event=>setMonth(event.target.value))}/>
                </Form.Group>
                </Col>
                    <Col md={5}>
                <Form.Group>   
                    <Form.Label>Năm</Form.Label>            
                    <Form.Control type="number" min="1900" max="2099" step="1" value ={year} onChange={(event=>setYear(event.target.value))}/>
                </Form.Group>
                <a  className="btn btn-danger" onClick= {test}>Thống kê</a>
                </Col>
                </Row>
            </Form>
            <div>
                {graph}
            </div>
        </>
    )
}