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
	case
		WHEN c.MotivoParadaId = 0 and c.CEPPTipoCEPP = "A" then 0
		WHEN m.MotivoParadaDescricao not like '%SETUP%' and c.CEPPTipoCEPP = "R" then 1
		WHEN m.MotivoParadaDescricao not like '%SETUP%' and c.CEPPTipoCEPP = "A" then 2
		WHEN m.MotivoParadaDescricao like '%SETUP%' and c.CEPPTipoCEPP = "A" then 3
		ELSE 0
	end processo_apont,
	0 fluxo_apont,
	case
		when m.MotivoParadaInterrupcaoPrevista is null then "N"
		else m.MotivoParadaInterrupcaoPrevista
	end prevista_apont,
	o.ProdutoCodigo item_apont,
	0 variacao_apont,
	0 acabamento_apont,
	o.RevestimentoId cor_apont,
	0 grade_apont,
	"" observacao_apont,
	c.CEPPQtdeProduzida quantidade_apont,
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
	-- 0 auditoria_apont,
	0 cicloprodutivo_apont,
	0 fatorrateiotempo_apont,
	now() datahorainclusao_apont,
	now() datahoraalteracao_apont,
	c.OperadorNome usuarioinclusao_apont,
	c.OperadorNome usuarioalteracao_apont
from cepp c
inner join ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join equipamento e on e.EquipamentoId = c.EquipamentoId
left join motivoparada m on m.MotivoParadaId = c.MotivoParadaId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP in ('P', 'R')
group by c.OrdemProducaoId, c.stSetorId, o.ProdutoCodigo, o.RevestimentoId, c.EquipamentoId
order by e.SetorId, c.CEPPDtInicio
;