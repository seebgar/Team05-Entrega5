import React, { Component } from 'react';
import axios from "axios";
import Cookies from 'universal-cookie';
const url_reservas = "http://localhost:5000/api/reservas";

const cookies = new Cookies();

const headers = {
    'Content-Type' : 'application/json',
    'authorization' : cookies.get('token')
  }

class Reservas extends Component {

    constructor(props) {
        super(props);

        this.state = {
            reservas: [],
            _idUsuario: this.props.getUsuario()._id,
        }

        this.get_reservas = this.get_reservas.bind(this);

    }

    componentDidMount() {
        this.get_reservas();
    }

    async get_reservas() {
        const prom = await axios.get(url_reservas, {headers:headers});
        if (prom.status < 300 && prom.status > 199) {
            this.setState({
                reservas: prom.data.filter(d => d._idUsuario === this.state._idUsuario)
            });
        } else {
            console.log(prom.status, "\n The response was not OK");
        }
    }

    estaFinalizado(prop){
        console.log(prop);
        if(prop.fechaFin != null){
            return <button className="btn btn-danger" onClick={()=>{this.updateFinalizado(prop._id)}}>Finalizar Reserva</button>
        }
    }

    async updateFinalizado(id){
        let d = Date();
        await axios.put(url_reservas + "/" + id, {fechaFin: d}).then((r) => {
            console.log(r);
        })
    }

    render() {

        return (
            <div className="host">
            {this.state.reservas.map((x, i) => {
                return (
                  <div
                    key={i}
                    className="col"
                    style={{ marginTop: "2em" }}
                  >
                    <div className="card" style={{ textAlign: "left" }}>
                      <div className="card-body">
                        <h2 className="card-title">Fecha </h2>
                        <h5 className = "card-body">{x.fechaInicio}</h5>
                        {this.estaFinalizado(x)}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
        );
    }
}

export default Reservas;