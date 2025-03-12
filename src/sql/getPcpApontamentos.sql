select
	0 autoinc_apont,
	c.CEPPId cepp_id,
	c.OrdemProducaoId ordemproducao_id,
	c.EmpresaId empresa_apont,
	c.CEPPDtCadastro data_apont,
	0 lote_apont,
	o.LoteProducaoId ordemproducao_apont,
	c.OperacoesCEPPId setor_apont,
	0 setor_processo_apont,
	0 setor_normal_apont,
	c.EquipamentoId postodetrabalho_apont,
	c.OperadorId responsavel_apont,
	0 turno_apont,
	case
		WHEN c.CEPPTipoCEPP = 'R' then 1
		when c.CEPPTipoCEPP = 'P' then 0
		when c.CEPPTipoCEPP = 'A' and m.MotivoParadaDescricao not like '%REGULAGEM%' then 2
		when c.CEPPTipoCEPP = 'A' and m.MotivoParadaDescricao like '%REGULAGEM%' then 3
		ELSE 0
	end processo_apont,
	0 fluxo_apont,
	case
		when m.MotivoParadaInterrupcaoPrevista is null then 'N'
		else m.MotivoParadaInterrupcaoPrevista
	end prevista_apont,
	case
		when c.CEPPTipoCEPP = 'A' then 0
		else o.ProdutoCodigo
	end item_apont,
	0 variacao_apont,
	0 acabamento_apont,
	case
		when c.CEPPTipoCEPP = 'A' then 0
		else o.RevestimentoId
	end cor_apont,
	0 grade_apont,
	"" observacao_apont,
	c.CEPPQtdeProduzida quantidade_apont,
	case
		when c.CEPPTipoCEPP = 'R' then 'Retrabalho'
		when c.CEPPTipoCEPP = 'P' then 'Produção'
		when c.CEPPTipoCEPP = 'A' and m.MotivoParadaDescricao not like '%REGULAGEM%' then 'Parada'
		when c.CEPPTipoCEPP = 'A' and m.MotivoParadaDescricao like '%REGULAGEM%' then 'Regulagem'
		else 'Produção'
	end observacao_apont,
	case
		when c.CEPPTipoCEPP = 'A' then 0
		else c.CEPPQtdeProduzida
	end quantidade_apont
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
	0 cicloprodutivo_apont,
	0 fatorrateiotempo_apont,
	now() datahorainclusao_apont,
	now() datahoraalteracao_apont,
	substr(e.EquipamentoDescricao, 1, 20) usuarioinclusao_apont,
	'' usuarioalteracao_apont
from cepp c
inner join ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join equipamento e on e.EquipamentoId = c.EquipamentoId
left join motivoparada m on m.MotivoParadaId = c.MotivoParadaId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP in ('P', 'R', 'A')
-- and o.LoteProducaoId = 0 /* valores são utilizados na API para o filtro */
-- and c.OperacoesCEPPId = 0 /* valores são utilizados na API para o filtro */
-- and c.EquipamentoId = 0 /* valores são utilizados na API para o filtro */
order by e.SetorId, c.CEPPDtInicio
;