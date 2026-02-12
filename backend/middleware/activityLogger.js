import ActivityLog from "../models/ActivityLog.js";
import Admin from "../models/Admin.js";

// Log kaydı oluşturan middleware
export const logActivity = (action, resourceType) => {
  return async (req, res, next) => {
    // Response'u yakalayabilmek için orijinal json metodunu sakla
    const originalJson = res.json.bind(res);

    res.json = function (body) {
      // Sadece başarılı işlemleri logla (2xx status codes)
      if (res.statusCode >= 200 && res.statusCode < 300) {
        // Async olarak log kaydet (response'u bloklamadan)
        setImmediate(async () => {
          try {
            const admin = await Admin.findByPk(req.adminId);
            if (!admin) return;

            let resourceId = null;
            let description = "";

            // Resource ID'yi bulmaya çalış
            if (req.params.id) resourceId = req.params.id;
            else if (body.id) resourceId = body.id;
            else if (body.seminar?.id) resourceId = body.seminar.id;
            else if (body.category?.id) resourceId = body.category.id;

            // Açıklama oluştur
            switch (action) {
              case "create":
                description = `Yeni ${resourceType} oluşturuldu`;
                if (body.title) description += `: ${body.title}`;
                if (body.name) description += `: ${body.name}`;
                break;
              case "update":
                description = `${resourceType} güncellendi`;
                if (req.params.id) description += ` (ID: ${req.params.id})`;
                break;
              case "delete":
                description = `${resourceType} silindi`;
                if (req.params.id) description += ` (ID: ${req.params.id})`;
                break;
              case "schedule":
                description = `${resourceType} planlandı`;
                break;
              case "cancel_schedule":
                description = `${resourceType} planlaması iptal edildi`;
                break;
              default:
                description = `${action} - ${resourceType}`;
            }

            await ActivityLog.create({
              adminId: req.adminId,
              adminUsername: admin.username,
              action,
              resourceType,
              resourceId,
              description,
              ipAddress: req.ip,
              userAgent: req.get("User-Agent"),
              metadata: {
                method: req.method,
                path: req.path,
                params: req.params,
                query: req.query,
              },
            });
          } catch (error) {
            console.error("Log kaydı hatası:", error);
          }
        });
      }

      return originalJson(body);
    };

    next();
  };
};
