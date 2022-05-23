import React from "react"
import API, { AuthAPI, endpoints } from "./API"


class DemoApp extends React.Component {
    constructor(props) {
        super(props)
        this.state = { cates: [] }
    }
    componentDidMount() {
        AuthAPI.get(endpoints["benxe"]).then(res => {
            console.log(res.data);
            this.setState({cates: res.data
        })
            }).catch(err => console.error(err))
        }
        render() {
        return (
            <ul>
                {this.state.cates.map(it => <li>{it.ten}</li>)}
            </ul>
        )
    }
}


export default DemoApp;