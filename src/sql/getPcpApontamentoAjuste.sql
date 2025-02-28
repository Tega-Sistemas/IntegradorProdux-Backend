select
	c.EmpresaId empresa_apont,
	c.CEPPDtCadastro data_apont,
	0 lote_apont,
	c.OrdemProducaoId ordemproducao_apont,
	e.SetorId setor_apont,
	0 setor_processo_apont,
	0 setor_normal_apont,
	c.EquipamentoId postodetrabalho_apont,
	c.OperadorId responsavel_apont,
	0 turno_apont,
	3 processo_apont,
	0 fluxo_apont,
	"N" prevista_apont,
	0 item_apont,
	0 variacao_apont,
	0 acabamento_apont,
	0 cor_apont,
	0 grade_apont,
	"" observacao_apont,
	0 quantidade_apont,
	CONCAT(
	    '1899-12-30 ',
	    DATE_FORMAT(c.CEPPDtInicio, '%H:%i:%s.'),
	    LPAD(MICROSECOND(c.CEPPDtInicio) DIV 1000, 3, '0')
	) horainicio_apont,
	CONCAT(
	    '1899-12-30 ',
	    DATE_FORMAT(c.CEPPDtTermino, '%H:%i:%s.'),
	    LPAD(MICROSECOND(c.CEPPDtTermino) DIV 1000, 3, '0')
	) horafim_apont,
	time_format(
		sec_to_time(ROUND(timestampdiff(second, c.CEPPDtInicio, c.CEPPDtTermino))),
		"1899-12-30 %H:%i:%s"
	) tempototal_apont,
	0 auditoria_apont,
	0 cicloprodutivo_apont,
	0 fatorrateiotempo_apont,
	now() datahorainclusao_apont,
	now() datahoraalteracao_apont,
	c.OperadorNome usuarioinclusao_apont,
	c.OperadorNome usuarioalteracao_apont
from integrador_produx.cepp c
inner join integrador_produx.ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join integrador_produx.equipamento e on e.EquipamentoId = c.EquipamentoId
inner join integrador_produx.motivoparada m on m.MotivoParadaId = c.MotivoParadaId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP in ('A')
and m.MotivoParadaDescricao like '%SETUP%'
order by e.SetorId, c.CEPPDtInicio
;