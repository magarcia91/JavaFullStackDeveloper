package com.mitocode.controller;

import java.net.URI;
import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.mitocode.exception.ModeloNotFoundException;
import com.mitocode.model.Signos;
import com.mitocode.service.ISignosService;

@RestController
@RequestMapping("/signos")
public class SignosController {

	@Autowired
	private ISignosService service;

	@GetMapping
	public ResponseEntity<List<Signos>> listar() throws Exception {
		List<Signos> lista = service.listar();
		return new ResponseEntity<List<Signos>>(lista, HttpStatus.OK);
	}

	@GetMapping("/pageable")
	public ResponseEntity<Page<Signos>> listarPageable(Pageable pageable) throws Exception {
		Page<Signos> page = service.listarPage(pageable);
		return new ResponseEntity<Page<Signos>>(page, HttpStatus.OK);
	}

	@GetMapping("/{id}")
	public ResponseEntity<Signos> PorId(@PathVariable("id") Integer id) throws Exception {
		Signos sig = service.listarPorId(id);
		if (sig.getIdSignos() == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}
		return new ResponseEntity<Signos>(sig, HttpStatus.OK);
	}

	@PostMapping
	public ResponseEntity<Signos> registrar(@Valid @RequestBody Signos sig) throws Exception {
		Signos obj = service.registrar(sig);
		URI location = ServletUriComponentsBuilder.fromCurrentRequest().path("/{id}").buildAndExpand(obj.getIdSignos())
				.toUri();
		return ResponseEntity.created(location).build();

	}
	
	@PutMapping
	public ResponseEntity<Signos> modificar(@RequestBody Signos sig) throws Exception{
		Signos signos = service.modificar(sig);
		return new ResponseEntity<Signos>(signos, HttpStatus.OK);
	}
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> eliminar(@PathVariable("id") Integer id) throws Exception{	
		Signos obj = service.listarPorId(id);
		if (obj.getIdSignos() == null) {
			throw new ModeloNotFoundException("ID NO ENCONTRADO" + id);
		}		
		service.eliminar(id);
		return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
	}
	
}
