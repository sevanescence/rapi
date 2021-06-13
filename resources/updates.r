
if (("installr" %in% rownames(installed.packages())) == FALSE) {
    install.packages("installr", repos = "https://cran.r-project.org/")
}
suppressPackageStartupMessages(library(installr))
update <- check.for.updates.R(notify_user = FALSE, GUI = FALSE) == FALSE
code <- if (update == TRUE) 0 else 2
q(status = code)
