select
	c.CEPPId ceppid,
	0 codigo_ciclopcp,
	c.EmpresaId empresa_ciclopcp,
	o.LoteProducaoId ordemproducao_ciclopcp,
	o.LoteProducaoERPId loteproducao_ciclopcp,
	c.OperacoesCEPPId setor_ciclopcp,
	c.EquipamentoId postodetrabalho_ciclopcp,
	c.OperadorId responsavel_ciclopcp,
	date_format(o.OrdemProducaoDtProgramado, "%Y-%m-%d 00:00:00.000") dtprevista_ciclopcp,
	date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00.000") dtexecucao_ciclopcp,
	date_format(c.CEPPDtInicio, "%Y-%m-%d 23:59:59.999") dttermino_ciclopcp,
	0 sequencial_ciclopcp,
	e.EquipamentoNroFuncionarios qtdepessoasequipe_ciclopcp,
	(
		select
			CONCAT(
			    '1899-12-30 ',
			    DATE_FORMAT(min(hri.CEPPDtInicio), '%H:%i:%s.'),
			    LPAD(MICROSECOND(min(hri.CEPPDtInicio)) DIV 1000, 3, '0')
			)
		from cepp hri
		inner join ordemproducao ohri on ohri.OrdemProducaoId = hri.OrdemProducaoId
		where ohri.LoteProducaoId = o.LoteProducaoId
		and hri.EquipamentoId = c.EquipamentoId
		and hri.CEPPDtInicio >= date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00")
		and hri.CEPPDtTermino <= date_format(c.CEPPDtTermino, "%Y-%m-%d 23:59:59")
	) horario_inicio_ciclopcp,
	(
		select
			CONCAT(
			    '1899-12-30 ',
			    DATE_FORMAT(max(hri.CEPPDtTermino), '%H:%i:%s.'),
			    LPAD(MICROSECOND(max(hri.CEPPDtTermino)) DIV 1000, 3, '0')
			)
		from cepp hri
		inner join ordemproducao ohri on ohri.OrdemProducaoId = hri.OrdemProducaoId
		where ohri.LoteProducaoId = o.LoteProducaoId
		and hri.EquipamentoId = c.EquipamentoId
		and hri.CEPPDtInicio >= date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00")
		and hri.CEPPDtTermino <= date_format(c.CEPPDtTermino, "%Y-%m-%d 23:59:59")
	) horario_termino_ciclopcp,
	time_format(
		sec_to_time(ROUND(timestampdiff(second, min(c.CEPPDtInicio), max(c.CEPPDtTermino)))),
		"1899-12-30 %H:%i:%s"
	) tempo_total_ciclopcp,
	case
		when c.CEPPOrdemAgrupadora is not null and c.CEPPOrdemAgrupado > 0
		then time_format(
			sec_to_time(ROUND(timestampdiff(second, min(c.CEPPDtInicio), max(c.CEPPDtTermino)))),
			"1899-12-30 %H:%i:%s"
		)
		else time_format(
			sec_to_time(Round(sum(ceppminutocentesimal) * 60)), "1899-12-30 %H:%i:%s"
		)
	end as tempoproduzindo_ciclopcp,
	(
		select
			COALESCE(
		        CONCAT(
		            '1899-12-30 ', 
		            TIME_FORMAT(SEC_TO_TIME(ROUND(SUM(ret.ceppminutocentesimal) * 60)), '%H:%i:%s')
		        ), 
		        '1899-12-30 00:00:00'
		    ) AS tempo_retrabalho
		from cepp ret
		inner join ordemproducao oret on oret.OrdemProducaoId = ret.OrdemProducaoId
		where ret.CEPPTipoCEPP = 'R'
		and oret.LoteProducaoId = o.LoteProducaoId
		and ret.EquipamentoId = c.EquipamentoId
		and ret.CEPPDtInicio >= date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00")
		and ret.CEPPDtTermino <= date_format(c.CEPPDtTermino, "%Y-%m-%d 23:59:59")
	) temporetrabalhando_ciclopcp,
	(
		select
			COALESCE(
		        CONCAT(
		            '1899-12-30 ', 
		            TIME_FORMAT(SEC_TO_TIME(ROUND(SUM(aj.ceppminutocentesimal) * 60)), '%H:%i:%s')
		        ), 
		        '1899-12-30 00:00:00'
		    ) AS tempo_ajuste
		from cepp aj
		inner join ordemproducao oaj on oaj.OrdemProducaoId = aj.OrdemProducaoId
		inner join motivoparada m on m.MotivoParadaId = aj.MotivoParadaId
		where aj.CEPPTipoCEPP = 'A'
		and m.MotivoParadaTpErpExterno = 'AJ'
		and oaj.LoteProducaoId = o.LoteProducaoId
		and aj.EquipamentoId = c.EquipamentoId
		and aj.CEPPDtInicio >= date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00")
		and aj.CEPPDtTermino <= date_format(c.CEPPDtTermino, "%Y-%m-%d 23:59:59")
	) tempoajustesmaq_ciclopcp,
	(
		select
			COALESCE(
		        CONCAT(
		            '1899-12-30 ', 
		            TIME_FORMAT(SEC_TO_TIME(ROUND(SUM(tp.ceppminutocentesimal) * 60)), '%H:%i:%s')
		        ), 
		        '1899-12-30 00:00:00'
		    ) AS tempo_parada
		from cepp tp
		inner join ordemproducao otp on otp.OrdemProducaoId = tp.OrdemProducaoId
		inner join motivoparada m on m.MotivoParadaId = tp.MotivoParadaId
		where tp.CEPPTipoCEPP = 'A'
		and m.MotivoParadaTpErpExterno <> 'AJ'
		and otp.LoteProducaoId = o.LoteProducaoId
		and tp.EquipamentoId = c.EquipamentoId
		and tp.CEPPDtInicio >= date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00")
		and tp.CEPPDtTermino <= date_format(c.CEPPDtTermino, "%Y-%m-%d 23:59:59")
	) tempointerrupcoes_ciclopcp,
	'1899-12-30 00:00:00.000' tempointerrupcao_p_ciclopcp,
	'1899-12-30 00:00:00.000' tempointerrupcao_t_ciclopcp,
	'1899-12-30 00:00:00.000' tempoprevistoproducao_ciclopcp,
	'1899-12-30 00:00:00.000' tempoprevistoajuste_ciclopcp,
	'1899-12-30 00:00:00.000' tempoprevistointerrup_ciclopcp,
	42 formularateio_ciclopcp,
	"ORIGEM: PRODUX" observacoes_ciclopcp,
	now() datahorainclusao_ciclopcp,
	now() datahoraalteracao_ciclopcp,
	substr(e.EquipamentoDescricao, 1, 20) usuarioinclusao_ciclopcp,
	"" usuarioalteracao_ciclopcp
from cepp c
inner join ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join equipamento e on e.EquipamentoId = c.EquipamentoId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP = 'P'
and c.CEPPSincronizado = 0
-- and o.LoteProducaoId = 3743
-- and c.CEPPDtCadastro >= curdate()
group by o.LoteProducaoId, c.EquipamentoId, c.OperacoesCEPPId, year(c.CEPPDtInicio), month(c.CEPPDtInicio), day(c.CEPPDtInicio)
order by o.LoteProducaoId, e.SetorId, c.CEPPDtInicio
;