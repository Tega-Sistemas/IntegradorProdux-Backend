select
	0 codigo_ciclopcp,
	c.EmpresaId empresa_ciclopcp,
	o.LoteProducaoId ordemproducao_ciclopcp,
	0 loteproducao_ciclopcp,
	c.OperacoesCEPPId setor_ciclopcp,
	c.EquipamentoId postodetrabalho_ciclopcp,
	c.OperadorId responsavel_ciclopcp,
	date_format(o.OrdemProducaoDtProgramado, "%Y-%m-%d 00:00:00.000") dtprevista_ciclopcp,
	date_format(c.CEPPDtInicio, "%Y-%m-%d 00:00:00.000") dtexecucao_ciclopcp,
	0 sequencial_ciclopcp,
	e.EquipamentoNroFuncionarios qtdepessoasequipe_ciclopcp,
	-- 	CONCAT(
-- 	    '1899-12-30 ',
-- 	    DATE_FORMAT(min(c.CEPPDtInicio), '%H:%i:%s.'),
-- 	    LPAD(MICROSECOND(min(c.CEPPDtInicio)) DIV 1000, 3, '0')
-- 	) horario_inicio_ciclopcp,
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
	) horario_inicio_ciclopcp,
-- 	CONCAT(
-- 	    '1899-12-30 ',
-- 	    DATE_FORMAT(max(c.CEPPDtTermino), '%H:%i:%s.'),
-- 	    LPAD(MICROSECOND(Max(c.CEPPDtTermino)) DIV 1000, 3, '0')
-- 	) horario_termino_ciclopcp,
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
	) horario_termino_ciclopcp,
	time_format(
		sec_to_time(ROUND(timestampdiff(second, min(c.CEPPDtInicio), max(c.CEPPDtTermino)))),
		"1899-12-30 %H:%i:%s"
	) tempo_total_ciclopcp,
	time_format(sec_to_time(Round(sum(ceppminutocentesimal) * 60)), "1899-12-30 %H:%i:%s") as tempoproduzindo_ciclopcp,
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
		where ret.CEPPTipoCEPP = 'R'
		and ret.OrdemProducaoId = c.OrdemProducaoId
		and ret.EquipamentoId = c.EquipamentoId
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
		inner join motivoparada m on m.MotivoParadaId = aj.MotivoParadaId
		where aj.CEPPTipoCEPP = 'A'
		and m.MotivoParadaDescricao like '%REGULAGEM%'
		and aj.OrdemProducaoId = c.OrdemProducaoId
		and aj.EquipamentoId = c.EquipamentoId
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
		inner join motivoparada m on m.MotivoParadaId = tp.MotivoParadaId
		where tp.CEPPTipoCEPP = 'A'
		and m.MotivoParadaDescricao not like '%REGULAGEM%'
		and tp.OrdemProducaoId = c.OrdemProducaoId
		and tp.EquipamentoId = c.EquipamentoId
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
	e.EquipamentoDescricao usuarioinclusao_ciclopcp,
	"" usuarioalteracao_ciclopcp
from cepp c
inner join ordemproducao o on o.OrdemProducaoId = c.OrdemProducaoId
inner join equipamento e on e.EquipamentoId = c.EquipamentoId
where c.OrdemProducaoCodReferencial <> ""
and c.CEPPTipoCEPP = 'P'
and c.CEPPSincronizado = 0
-- and o.LoteProducaoId = 3573
-- and c.CEPPDtCadastro >= curdate()
group by o.LoteProducaoId, c.EquipamentoId, c.OperacoesCEPPId
order by o.LoteProducaoId, e.SetorId, c.CEPPDtInicio
;