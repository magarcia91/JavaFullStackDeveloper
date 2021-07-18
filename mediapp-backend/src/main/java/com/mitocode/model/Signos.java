package com.mitocode.model;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ForeignKey;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="signos")
public class Signos {


	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer idSignos;
	
	@ManyToOne
	@JoinColumn(name= "id_paciente", nullable= false , foreignKey = @ForeignKey (name= "FK_signos_paciente"))
	private Paciente paciente;	
	
	@Column(name="fecha", nullable = true)
	private LocalDateTime fecha;
	
	@Column(name="temperatura", nullable = true)
	private Double temperatura;
	
	@Column(name="pulso", nullable = true)
	private Integer pulso;
	
	@Column(name="ritmo_respitario", nullable = true)
	private LocalDateTime ritmoRespiratorio;
	

	public Integer getIdSignos() {
		return idSignos;
	}

	public void setIdSignos(Integer idSignos) {
		this.idSignos = idSignos;
	}
	
	public Paciente getPaciente() {
		return paciente;
	}

	public void setPaciente(Paciente paciente) {
		this.paciente = paciente;
	}
	
	public LocalDateTime getFecha() {
		return fecha;
	}

	public void setFecha(LocalDateTime fecha) {
		this.fecha = fecha;
	}

	public Double getTemperatura() {
		return temperatura;
	}

	public void setTemperatura(Double temperatura) {
		this.temperatura = temperatura;
	}

	public Integer getPulso() {
		return pulso;
	}

	public void setPulso(Integer pulso) {
		this.pulso = pulso;
	}

	public LocalDateTime getRitmoRespiratorio() {
		return ritmoRespiratorio;
	}

	public void setRitmoRespiratorio(LocalDateTime ritmoRespiratorio) {
		this.ritmoRespiratorio = ritmoRespiratorio;
	}
	
}
