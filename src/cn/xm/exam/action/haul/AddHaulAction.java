package cn.xm.exam.action.haul;

import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Controller;

import com.opensymphony.xwork2.ActionSupport;
import com.opensymphony.xwork2.ModelDriven;

import cn.xm.exam.bean.haul.Haulinfo;
import cn.xm.exam.service.haul.HaulinfoService;

/**
 * 增加大修Action(ajax方式增加)
 * 
 * @author QiaoLiQiang
 * @time 2017年11月9日下午10:31:12
 */
@Controller // 控制层
@Scope("prototype") // 多例.单例是singleton
@SuppressWarnings("all") // 压制警告
public class AddHaulAction extends ActionSupport implements ModelDriven<Haulinfo> {
	private Haulinfo haulinfo = new Haulinfo();// 模型驱动对象
	private Map<String, Object> response;// 作为结果返回的map
	private Logger logger = Logger.getLogger(AddHaulAction.class);// 日志记录器
	@Autowired // 自动装配
	private HaulinfoService haulinfoService;

	@Override
	public String execute() {
		response = new HashMap<String, Object>();
		String result = "";
		try {
			result = haulinfoService.addHaulinfo(haulinfo) ? "添加成功!" : "添加失败!";
		} catch (SQLException e) {
			logger.error("添加大修出错", e);
		}
		response.put("result", result);
		return SUCCESS;
	}

	@Override
	public Haulinfo getModel() {
		return haulinfo;
	}
	// get set

	public Map<String, Object> getResponse() {
		return response;
	}

	public void setResponse(Map<String, Object> response) {
		this.response = response;
	}
	
}
